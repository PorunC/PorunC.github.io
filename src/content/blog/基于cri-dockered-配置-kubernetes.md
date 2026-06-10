---
title: Configure Kubernetes based on cri-dockerd
date: '2022-12-14T06:19:02.000Z'
updated: '2022-12-15T09:46:25.000Z'
tags: []
categories: []
slug: 2022/12/14/基于cri-dockered-配置-kubernetes
oldUrl: /2022/12/14/基于cri-dockered-配置-kubernetes/
excerpt: >-
  1. Computer MacOS Monterey Version 12.3.1 (21E258) MacBook Air (M1, 2020) Chip
  Apple M1 Memory 8 GB 2. Virtual Machine Parallels Desktop 18 for Mac Business
  Edition Version 18.0.2 ...
---
## 1. Environment

1. Computer
   - MacOS Monterey
   - Version 12.3.1 (21E258)
   - MacBook Air (M1, 2020) Chip Apple M1
   - Memory 8 GB
2. Virtual Machine
   - Parallels Desktop 18 for Mac
   - Business Edition
   - Version 18.0.2 (53077)
3. ISO file
   - ubuntu-22.04.1-live-server-arm64.iso
   - download URL: <https://cdimage.ubuntu.com/releases/22.04/release/ubuntu-22.04.1-live-server-arm64.iso>
   - NetWork: Bridged Network Default Adapter
4. Software Version
   - docker: 20.10.21
   - cri-dockerd: 0.2.6.arm64
   - kubeadm : 1.25
   - kubectl : 1.25
   - kubelet : 1.25

## 2. Config the host

```bash
sudo apt-get update && sudo apt-get upgrade
sudo echo \
'
172.20.10.5  k8s-master
172.20.10.6  k8s-node1
172.20.10.3  k8s-node2
' >> /etc/hosts
```

## 3. Close selinux

```bash
sudo touch /etc/selinux/config
sudo sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
# Restart the machine to take effect
reboot
```

## 4. Close the Swap

```bash
sudo swapoff -a
sudo sed -i '/swap/s/^/#/' /etc/fstab 
```

## 5. Enabling IPv4 Forwarding

```bash
sudo cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter
sudo cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF
sudo sysctl --system
```

## 6. Install docker and configure the Cgroupdriver

```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER

## Modify the docker process manager
sudo cat > /etc/docker/daemon.json << EOF
{
"registry-mirrors": [
"https://docker.mirrors.ustc.edu.cn",
"https://hub-mirror.c.163.com",
"https://reg-mirror.qiniu.com",
"https://registry.docker-cn.com"
],
"exec-opts": ["native.cgroupdriver=systemd"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
sudo systemctl status docker
```

## 7. Install the cri-docker and start

```bash
wget https://github.com/Mirantis/cri-dockerd/releases/download/v0.2.6/cri-dockerd-0.2.6.arm64.tgz
tar -xf cri-dockerd-0.2.6.arm64.tgz
cp cri-dockerd/cri-dockerd /usr/bin/
chmod +x /usr/bin/cri-dockerd
```

Configure the cri-dockerd

```bash
cat <<"EOF" > /usr/lib/systemd/system/cri-docker.service
[Unit]
Description=CRI Interface for Docker Application Container Engine
Documentation=https://docs.mirantis.com
After=network-online.target firewalld.service docker.service
Wants=network-online.target
Requires=cri-docker.socket

[Service]
Type=notify

ExecStart=/usr/bin/cri-dockerd --network-plugin=cni --pod-infra-container-image=registry.aliyuncs.com/google_containers/pause:3.7

ExecReload=/bin/kill -s HUP $MAINPID
TimeoutSec=0
RestartSec=2
Restart=always

StartLimitBurst=3

StartLimitInterval=60s

LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity

TasksMax=infinity
Delegate=yes
KillMode=process

[Install]
WantedBy=multi-user.target

EOF

cat <<"EOF" > /usr/lib/systemd/system/cri-docker.socket
[Unit]
Description=CRI Docker Socket for the API
PartOf=cri-docker.service

[Socket]
ListenStream=%t/cri-dockerd.sock
SocketMode=0660
SocketUser=root
SocketGroup=docker

[Install]
WantedBy=sockets.target

EOF
```

Start the cri-docker

```bash
systemctl daemon-reload
systemctl start cri-docker
systemctl enable cri-docker
systemctl status cri-docker
```

## 8. Install kubeadm kubectl kubelet and enable it

```bash
sudo apt-get install -y apt-transport-https
curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add - 
echo 'deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main' >> /etc/apt/sources.list
sudo apt-get update
sudo apt-get install -y kubelet=1.25.0-00 kubeadm=1.25.0-00 kubectl=1.25.0-00
```

## 9. Configure Master

```bash
# Master Node
echo '
apiVersion: kubeadm.k8s.io/v1beta3
bootstrapTokens:
- groups:
  - system:bootstrappers:kubeadm:default-node-token
  token: abcdef.0123456789abcdef
  ttl: 24h0m0s
  usages:
  - signing
  - authentication
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: [IP address of this machine]
  bindPort: 6443
nodeRegistration:
  criSocket: unix:///var/run/cri-dockerd.sock
  imagePullPolicy: IfNotPresent
  name: [Host name of this machine]
  taints: null
---
apiServer:
  timeoutForControlPlane: 4m0s
apiVersion: kubeadm.k8s.io/v1beta3
certificatesDir: /etc/kubernetes/pki
clusterName: kubernetes
controllerManager: {}
dns: {}
etcd:
  local:
    dataDir: /var/lib/etcd
imageRepository: registry.aliyuncs.com/google_containers
kind: ClusterConfiguration
kubernetesVersion: 1.25.0
networking:
  dnsDomain: cluster.local
  serviceSubnet: 10.96.0.0/12 # Pod 
scheduler: {}
---
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
cgroupDriver: systemd   # Set it to systemd
' > kubeadm-config.yaml

sudo kubeadm init --config kubeadm-config.yaml
```

To start using your cluster, you need to run the following as a regular user:

```bash
mkdir -p $HOME/.kube
sudo cp -i etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

## 10. Configure Node

```bash
# Node 
kubeadm join <control-plane-endpoint>:6443 --token <token> \
--discovery-token-ca-cert-hash sha256:<hash> \
--cri-socket /run/containerd/containerd.sock \
--node-name <nodename>
```

## 11. Installing Network Plugin

```bash
## If the status of all nodes changes to ready after installation, it is a success
wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
kubectl apply -f ./kube-flannel.yml
kubectl get nodes
```

If the network segment of the Pod CIDR is not 10.244.0.0/16, change the network segment in the flannel configuration to be the same as that in the Pod CIDR.

## 12. reset deployment

```bash
#!/usr/bin/env bash

sudo kubeadm reset -f

# Clear the data directory
sudo rm -fr /var/lib/etcd
sudo rm -fr /etc/kubernetes
sudo rm -fr ~/.kube/

# delete flannel
ifconfig cni0 down
ip link delete cni0
ifconfig flannel.1 down
ip link delete flannel.1
sudo rm -rf /var/lib/cni/
sudo rm -f /etc/cni/net.d/*
kubectl delete -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
 
systemctl restart docker
systemctl restart kubelet
```

## Reference

- [使用kubeadm安装生产环境kubernetes](https://k8s.huweihuang.com/project/setup/installer/install-k8s-by-kubeadm)
- [Centos7.9 arm架构 搭建 k8s v1.24.0 (超新)](https://www.modb.pro/db/475881)

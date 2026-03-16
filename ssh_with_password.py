#!/usr/bin/env python3
"""
使用密码进行 SSH 连接的辅助脚本
"""
import sys
import subprocess
import pexpect

def ssh_exec(host, user, password, command):
    """执行 SSH 命令"""
    ssh_cmd = f"ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=10 {user}@{host} '{command}'"
    
    try:
        child = pexpect.spawn(ssh_cmd, encoding='utf-8', timeout=300)  # 增加总超时到5分钟
        child.logfile = sys.stdout
        
        index = child.expect(['password:', 'Password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
        
        if index in [0, 1]:
            child.sendline(password)
            child.expect(pexpect.EOF, timeout=300)  # 增加命令执行超时到5分钟
        
        child.close()
        return child.exitstatus == 0
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: ssh_with_password.py <host> <user> <password> <command>")
        sys.exit(1)
    
    host = sys.argv[1]
    user = sys.argv[2]
    password = sys.argv[3]
    command = " ".join(sys.argv[4:])
    
    success = ssh_exec(host, user, password, command)
    sys.exit(0 if success else 1)

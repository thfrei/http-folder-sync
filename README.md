# http-folder-sync (a.k.a hfs)
Hnstantly share and sync a folder over an http-tunnel.


Installation
------------
```
npm install -g http-folder-sync
```

Usage
-----
Master: In the folder that you want to share type: `http-folder-sync-master` or `hfs`

Copy the ngrok url.

Slave: Navigat eto an empty folder and type: `http-folder-sync-slave -h <ngrokurl>` or `hfss -h <ngrokurl>` 

_Info_: The folder from the master is shared as read-only. The folder is kept in sync with the slave.

Roadmap
-------
* Two-way-syncing
* Ignore folders and files
* Alternative tunneling options
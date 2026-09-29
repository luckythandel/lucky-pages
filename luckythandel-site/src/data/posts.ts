export interface Post {
  slug: string
  title: string
  tag: string
  date: string
  summary: string
  level?: string
  body: string[]
}

export const writeups: Post[] = [
  {
    slug: 'htb-blue-eternalblue',
    title: 'HTB Blue: EternalBlue (MS17-010) from nmap to SYSTEM',
    tag: 'retired-machine',
    date: '2026-09-29',
    level: 'easy',
    summary:
      'The famous Windows 7 box done properly: SMB recon, confirming MS17-010, exploiting EternalBlue to SYSTEM, and the patching lessons that still matter.',
    body: [
      'Blue is a retired HackTheBox easy machine and the single best teacher of why unpatched SMB is catastrophic. This walkthrough follows my standard checklist: enumerate completely first, confirm the vulnerability, then exploit — no guessing. Lab target only; the techniques below are for retired boxes and authorized systems.',
      'Recon: nmap -sC -sV shows ports 135 (RPC), 139 (NetBIOS) and 445 (SMB) on Windows 7 Professional SP1. That combination — SMB open on an old Windows build — is the smell of EternalBlue. Before touching exploits, confirm it: nmap --script smb-vuln-ms17-010 -p 445 reports the host VULNERABLE to remote code execution in SMBv1 (MS17-010).',
      'Quick SMB enumeration first, because the checklist says so: smbclient -L and enum4linux to list shares and users. On Blue there is nothing to log into — the shares are empty or inaccessible — which tells you the intended path is the SMB service itself, not credentials.',
      'Exploitation: Metasploit module exploit/windows/smb/ms17_010_eternalblue. Set RHOSTS to the target, set LHOST to your tunneled address, default Windows x64 Meterpreter reverse TCP payload — then run. The module negotiates the SMBv1 transaction overflow and returns a session as NT AUTHORITY\\SYSTEM on the first try when the target is genuinely unpatched.',
      'Flags: Blue is easy-rated, so user.txt sits on a standard user desktop while root.txt needs SYSTEM. EternalBlue lands you as SYSTEM directly, so both flags fall in one session — use Meterpreter search -f to locate them, then read each file. (Flag values are redacted here per HTB rules; earn them in your own lab.)',
      'Why this works: MS17-010 is a buffer overflow in how SMBv1 handles crafted Trans2 requests. The exploit corrupts kernel pool memory to gain arbitrary code execution at the highest privilege level — which is why one vulnerability equals total compromise, no privilege escalation step needed.',
      'Dead ends I hit so you do not have to: trying SMB brute-force first (wasted twenty minutes — always run the vuln script before password guessing), and forgetting to set LHOST after switching VPN servers (the classic silent failure — session never calls home).',
      'Remediation notes for the defender side: disable SMBv1 everywhere, apply the MS17-010 patch, block port 445 at the perimeter, and alert on any SMBv1 negotiation still happening on the network. WannaCry wormed the planet through exactly this hole in 2017 — unpatched SMB is never just a lab problem.',
      'Next in this series: more retired-machine walkthroughs following the same checklist. Written by Lucky Thandel.',
    ],
  },
  {
    slug: 'htb-lame-vsftpd-samba',
    title: 'HTB Lame: vsftpd backdoor and Samba usermap_script to root',
    tag: 'retired-machine',
    date: '2026-09-30',
    level: 'easy',
    summary:
      'The first box everyone roots: a backdoored FTP daemon on port 6200 and an unauthenticated Samba RCE — two roads to root on one machine.',
    body: [
      'Lame is a retired HackTheBox easy Linux machine and the traditional first root for most players. It runs several old, intentionally vulnerable services side by side, which makes it perfect for learning the enumerate-everything habit: nmap shows FTP (vsftpd 2.3.4), SSH, and Samba 3.0.20, among others.',
      'Road one — the vsftpd 2.3.4 backdoor: this version contains a malicious planted backdoor where logging in with a username ending in :) opens a shell on port 6200. Netcat to that port and you land as root immediately. It is the fastest root on the box, and the lesson is version fingerprinting: -sV output plus one search turns a version string into a working exploit.',
      'Road two — Samba usermap_script (CVE-2007-2447): Samba 3.0.20 maps usernames through a script without authentication, so Metasploit module exploit/multi/samba/usermap_script gives a root shell with no credentials at all. This is the road I document in full, because unauthenticated RCE in a file-sharing service is a pattern that still shows up in real networks.',
      'Flags: user.txt on a low-privilege home directory, root.txt in /root — both readable once you have the root shell from either road. (Values redacted per HTB rules; earn them in your own lab.)',
      'Dead ends I hit so you do not have to: trying to brute-force SSH first (the box wants you to read service versions, not guess passwords) and overcomplicating the Samba path with valid credentials (the exploit needs none — that is the whole point).',
      'Remediation notes: retire vsftpd 2.3.4 and Samba 3.x entirely, patch or replace legacy file services, and treat any shell listener on an unexpected high port (like 6200) as a compromise indicator worth an alert.',
      'Next in this series: more retired-machine walkthroughs. Written by Lucky Thandel.',
    ],
  },
  {
    slug: 'htb-legacy-ms08-067',
    title: 'HTB Legacy: MS08-067 netapi from scan to SYSTEM',
    tag: 'retired-machine',
    date: '2026-10-01',
    level: 'easy',
    summary:
      'Windows XP, port 445, one legendary patch missing: confirming and exploiting MS08-067 netapi to SYSTEM with Metasploit.',
    body: [
      'Legacy is a retired HackTheBox easy Windows machine — a Windows XP box standing next to Blue in every beginner roadmap. The flow is deliberately parallel to the Blue write-up: SMB recon, vulnerability confirmation, then one classic exploit. If you rooted Blue, Legacy teaches you the older sibling of the same bug class.',
      'Recon: nmap -sC -sV shows Microsoft-DS on 445 with an XP-era fingerprint, plus RDP and NetBIOS. Confirm before exploiting: nmap --script smb-vuln-ms08-067 -p 445 flags the host vulnerable to the NetAPI buffer overflow (MS08-067). Same discipline as always — confirmed CVE, not a hunch.',
      'Exploitation: Metasploit module exploit/windows/smb/ms08_067_netapi with RHOSTS set and a Windows Meterpreter reverse TCP payload. The module fingerprints the exact XP service pack automatically and lands a session as NT AUTHORITY\\SYSTEM.',
      'Flags: user-accessible user.txt plus root.txt in the Administrator profile — both fall in the single SYSTEM session. (Values redacted per HTB rules; earn them in your own lab.)',
      'Why this works: MS08-067 is a stack overflow in the Server service NetpwPathCanonicalize function — a canonicalization bug in an RPC-reachable path. Like EternalBlue after it, one malformed request equals SYSTEM, which is why exposed SMB on unpatched Windows is game over.',
      'Dead ends I hit so you do not have to: picking the wrong target index manually (let the module auto-target — it reads the fingerprint better than I guess it) and forgetting LHOST after a VPN reconnect (the silent session-that-never-calls-home, again).',
      'Remediation notes: MS08-067 was the Conficker worm vector in 2008 — patch it, retire XP, block 445 at the edge, and inventory any remaining legacy Windows before an attacker does.',
      'Next in this series: more retired-machine walkthroughs. Written by Lucky Thandel.',
    ],
  },
  {
    slug: 'htb-devel-ftp-webshell',
    title: 'HTB Devel: anonymous FTP upload to IIS webshell to SYSTEM',
    tag: 'retired-machine',
    date: '2026-10-02',
    level: 'easy',
    summary:
      'Write access over anonymous FTP plus IIS serving the same folder: uploading an ASP webshell, catching the shell, then KiTrap0D to SYSTEM.',
    body: [
      'Devel is a retired HackTheBox easy Windows machine built around one misconfiguration with two halves: an FTP server that allows anonymous write access, and an IIS web server that serves the same directory over HTTP. Either half alone is boring — together they are a webshell pipeline.',
      'Recon: nmap shows FTP (IIS-hosted) and HTTP (IIS 7.5) on Windows 7. Logging into FTP as anonymous succeeds — and crucially, uploads succeed too. Browsing the HTTP site shows the uploaded files are served back. That loop — write via FTP, execute via HTTP — is the whole foothold.',
      'Foothold: generate an ASP Meterpreter payload with msfvenom, upload it over anonymous FTP, then request it through the browser with a handler listening. The page executes server-side and a session opens as the IIS application-pool user — low privilege, but inside.',
      'Privilege escalation: upload Sherlock or run local_exploit_suggester, which points at the missing KiTrap0D patch (MS10-015). Metasploit module exploit/windows/local/ms10_015_kitrap0d elevates the session to NT AUTHORITY\\SYSTEM, and both flags fall. (Values redacted per HTB rules.)',
      'Dead ends I hit so you do not have to: uploading a PHP shell first out of habit (the server runs ASP — match the payload to the stack) and triggering the shell before starting the handler (always listeners first, clicks second).',
      'Remediation notes: never allow anonymous FTP write, never serve an upload directory with script execution enabled, and patch kernel privesc CVEs — the foothold-to-SYSTEM chain here used two separate decade-old misses.',
      'Next in this series: more retired-machine walkthroughs. Written by Lucky Thandel.',
    ],
  },
  {
    slug: 'htb-optimum-hfs-rce',
    title: 'HTB Optimum: HttpFileServer RCE and MS16-032 to SYSTEM',
    tag: 'retired-machine',
    date: '2026-10-03',
    level: 'easy',
    summary:
      'A file-sharing web app with a search-box RCE (CVE-2014-6287), then Sherlock plus MS16-032 for the SYSTEM finish on Server 2012.',
    body: [
      'Optimum is a retired HackTheBox easy Windows machine centered on HttpFileServer (HFS) 2.3 — a tiny personal file-sharing web app. nmap shows only HTTP on a Windows Server 2012 fingerprint, and the page title gives the product and version away immediately. One product, one version, one famous CVE.',
      'Recon that matters: open the HFS page, confirm version 2.3 in the interface, and note the search box — that input field is the exploit vector for CVE-2014-6287, a null-byte-skipping RCE in the search parser. Version plus vector identified before any payload fires.',
      'Exploitation: Metasploit module exploit/windows/http/rejetto_hfs_exec with RHOSTS and an HTTP target URI. The module abuses the search routine to execute a payload and returns a session as the service user — foothold on Server 2012 in one request.',
      'Privilege escalation: the service account is low-privilege, so run Sherlock.ps1 (or local_exploit_suggester) inside the session — it flags the missing MS16-032 patch. Metasploit module exploit/windows/local/ms16_032_secondary_logon_handle_privesc duplicates a SYSTEM token through the Secondary Logon handle leak and both flags fall. (Values redacted per HTB rules.)',
      'Dead ends I hit so you do not have to: trying directory traversal manually for an hour (the Metasploit module encodes the null-byte trick correctly — read its source after it works, not before) and running privesc checks before stabilizing the shell (migrate to a stable process first).',
      'Remediation notes: retire HFS 2.x entirely — it is abandonware with public RCE — patch kernel token bugs like MS16-032 fast, and treat any single-purpose web app on a server as part of the patch inventory, not furniture.',
      'Next in this series: more retired-machine walkthroughs. Written by Lucky Thandel.',
    ],
  },
  {
    slug: 'htb-bashed-phpbash-cron',
    title: 'HTB Bashed: phpbash webshell and a cron job to root',
    tag: 'retired-machine',
    date: '2026-10-04',
    level: 'easy',
    summary:
      'A webshell hiding in /dev, a writable cron script running as scriptmanager, and a passwordless sudo: the full Linux ladder on one box.',
    body: [
      'Bashed is a retired HackTheBox easy Linux machine that teaches the classic web-to-root ladder in miniature. nmap shows Apache on Ubuntu, and gobuster quickly finds /dev/phpbash.min.php — a full PHP terminal webshell sitting in the open. The lesson starts before any shell: enumerate web paths, because developers leave tools behind.',
      'Foothold: phpbash is interactive in the browser, but upgrade it — spawn a proper reverse shell (python3 -c pty or a netcat callback) to get a www-data shell you can work in. Confirm the user, stabilize with script /dev/null and stty, then start Linux enumeration: users, cron jobs, and SUID binaries.',
      'The privesc signal: a cron job runs /scripts/test.py every minute as the scriptmanager user — and the file is writable. Overwrite it with a Python reverse-shell one-liner, wait for the minute tick, and catch the callback as scriptmanager. Writable files executed by other users are the single most common Linux privesc on easy boxes.',
      'Root: as scriptmanager, sudo -l reveals a passwordless sudo path — sudo su - (or the listed binary) drops you to root, and both flags fall. user.txt in a home directory, root.txt in /root. (Values redacted per HTB rules; earn them in your own lab.)',
      'Dead ends I hit so you do not have to: treating phpbash as enough (browser shells die — always upgrade to a real reverse shell first) and running LinPEAS before the manual pass (the cron job was visible in /etc/crontab in ten seconds; automation is the second pass, not the first).',
      'Remediation notes: remove dev webshells from production, never leave cron-executed scripts world-writable, and audit sudo -l output on every host — passwordless entries are standing root access.',
      'Next in this series: more retired-machine walkthroughs. Written by Lucky Thandel.',
    ],
  },
  {
    slug: 'htb-nibbles-blog-upload',
    title: 'HTB Nibbles: Nibbleblog upload RCE and a sudo script to root',
    tag: 'retired-machine',
    date: '2026-10-05',
    level: 'easy',
    summary:
      'Guessed admin creds, a plugin upload that takes PHP (CVE-2015-6967), then a NOPASSWD monitor.sh that hands over root.',
    body: [
      'Nibbles is a retired HackTheBox easy Linux machine built around Nibbleblog — a tiny CMS. nmap shows Apache plus an SSH port, and gobuster finds /nibbleblog/. The admin login falls to the classic weak credential admin:nibbles. Lesson one of this box: default and guessable CMS creds are still a foothold in the wild.',
      'Foothold via CVE-2015-6967: Nibbleblog 4.0.3 lets an authenticated admin upload plugin files, and the my_image plugin accepts a PHP file disguised as an image. Upload the shell through the plugin interface, browse to the uploaded file, and catch the callback as the nibbler web user.',
      'Enumeration as nibbler: the home directory holds personal/stuff/monitor.sh — and sudo -l shows it runnable as root with NOPASSWD. The script itself is writable, which is the entire vulnerability: append a /bin/bash payload (or a reverse shell) to monitor.sh, run it with sudo, and you are root.',
      'Flags: user.txt under /home/nibbler, root.txt in /root. (Values redacted per HTB rules; earn them in your own lab.)',
      'Dead ends I hit so you do not have to: fuzzing for exotic RCE before trying the login (the creds are the intended door — always test defaults on CMS logins) and uploading a raw .php file (the plugin path expects the upload flow — follow the CVE write-up steps exactly).',
      'Remediation notes: patch or replace end-of-life CMS software, enforce strong unique admin passwords, and never grant NOPASSWD sudo on scripts that non-root users can modify — that is root by delegation.',
      'Next in this series: more retired-machine walkthroughs. Written by Lucky Thandel.',
    ],
  },
  {
    slug: 'htb-shocker-shellshock-perl',
    title: 'HTB Shocker: Shellshock CGI to shell, perl sudo to root',
    tag: 'retired-machine',
    date: '2026-10-06',
    level: 'easy',
    summary:
      'A .sh in /cgi-bin plus a 2014 bug that never died (CVE-2014-6271), then a textbook perl NOPASSWD sudo for root.',
    body: [
      'Shocker is a retired HackTheBox easy Linux machine named for exactly one bug: Shellshock. nmap shows Apache, and gobuster finds /cgi-bin/ containing user.sh — a CGI shell script. CGI plus bash plus 2014-era software is the whole threat model; the box teaches historic CVE exploitation that still appears on unpatched estates.',
      'Foothold via CVE-2014-6271: bash processes attacker-controlled environment variables through CGI, so a crafted User-Agent header — () { :; }; <command> — executes commands server-side. Send the payload with curl against /cgi-bin/user.sh, catch the reverse shell, and you land as the low-privilege shelly user.',
      'Enumeration as shelly is short: sudo -l shows /usr/bin/perl runnable as root with NOPASSWD. Perl can exec anything, so sudo perl -e exec "/bin/sh" is an instant root shell. Two CVEs, two one-liners, total compromise — easy boxes often chain exactly like this.',
      'Flags: user.txt in the shelly home directory, root.txt in /root. (Values redacted per HTB rules; earn them in your own lab.)',
      'Dead ends I hit so you do not have to: testing the header against the main site instead of the CGI script (Shellshock needs the bash CGI execution path — aim at user.sh) and forgetting URL-encoding quirks (test the payload shape with a sleep/id callback first).',
      'Remediation notes: patch bash everywhere (yes, still — embedded and legacy systems linger), remove CGI where possible, and treat NOPASSWD on interpreters (perl, python, vim, awk) as equivalent to passwordless root.',
      'Next in this series: more retired-machine walkthroughs. Written by Lucky Thandel.',
    ],
  },
  {
    slug: 'htb-jerry-tomcat-deploy',
    title: 'HTB Jerry: Tomcat manager deploy straight to SYSTEM',
    tag: 'retired-machine',
    date: '2026-10-07',
    level: 'easy',
    summary:
      'Default Tomcat manager creds, one malicious WAR upload, and the service account is already SYSTEM — the shortest path on this list.',
    body: [
      'Jerry is a retired HackTheBox easy Windows machine and the shortest write-up in this series. nmap shows a single interesting port: 8080 serving Apache Tomcat 7. The manager login falls to the default credential pair tomcat:s3cret. Lesson: management consoles with vendor defaults are a foothold, not a finding-to-note-later.',
      'Exploitation: build a malicious WAR with msfvenom (java/jsp_shell_reverse_tcp), log into the Tomcat manager, deploy the WAR through the upload form, then trigger it and catch the session. Alternatively Metasploit module exploit/multi/http/tomcat_mgr_deploy automates the whole chain — I show the manual WAR route first so the mechanism is visible.',
      'No privesc needed: the Tomcat service runs as SYSTEM, so the deployed shell lands directly at the highest privilege and both flags fall in one session. user.txt and root.txt locations follow the usual Windows layout. (Values redacted per HTB rules; earn them in your own lab.)',
      'Dead ends I hit so you do not have to: trying manager-script API calls before the HTML manager (the web form deploy is simpler and always available) and generating a WAR for the wrong Java payload type (match jsp_shell to the Tomcat/JSP stack).',
      'Remediation notes: change every default console credential, restrict manager access by IP, run services as least-privilege accounts (SYSTEM-by-default is what made this one step instead of three), and patch or retire Tomcat 7.',
      'Next in this series: more retired-machine walkthroughs. Written by Lucky Thandel.',
    ],
  },
  {
    slug: 'htb-grandpa-webdav-overflow',
    title: 'HTB Grandpa: IIS 6 WebDAV overflow straight to SYSTEM',
    tag: 'retired-machine',
    date: '2026-10-08',
    level: 'easy',
    summary:
      'Windows Server 2003, one ancient web server, one public buffer overflow (CVE-2017-7269): from IIS version string to SYSTEM in a single exploit.',
    body: [
      'Grandpa is a retired HackTheBox easy Windows machine that teaches version-driven exploitation at its purest. nmap shows Microsoft IIS 6.0 on Windows Server 2003 — a stack old enough that its flagship public exploit, CVE-2017-7269, is practically part of the curriculum. Confirm the version, match the CVE, exploit.',
      'The vulnerability lives in the WebDAV ScStoragePathFromUrl function: a crafted PROPFIND/PROPPATCH request with an overlong If header overflows a buffer and hijacks execution. Metasploit module exploit/windows/iis/iis_webdav_scstoragepathfromurl handles the offsets — set RHOSTS, a Windows Meterpreter payload, and run.',
      'No separate privilege escalation: the IIS worker process context yields NT AUTHORITY\\SYSTEM directly, so user.txt and root.txt both fall in the single session. (Flag values redacted per HTB rules; earn them in your own lab.)',
      'Dead ends I hit so you do not have to: fuzzing the website for injection first (the site is static decoration — the service version is the vulnerability) and doubting a 2017 CVE on a 2003 box (unpatched legacy is exactly where old exploits live forever).',
      'Remediation notes: retire Server 2003 and IIS 6 entirely — no patch posture saves an end-of-life stack — disable WebDAV where unused, and treat any IIS 6 banner on a scan as a critical finding on sight.',
      'Next in this series: more retired-machine walkthroughs. Written by Lucky Thandel.',
    ],
  },
  {
    slug: 'htb-granny-webdav-retarget',
    title: 'HTB Granny: the same WebDAV bug, retargeted and re-owned',
    tag: 'retired-machine',
    date: '2026-10-09',
    level: 'easy',
    summary:
      'Grandpa’s twin with a twist: the same CVE-2017-7269 needs different targeting — a lesson in reading exploit code instead of just running it.',
    body: [
      'Granny is a retired HackTheBox easy Windows machine and Grandpa’s deliberate twin: another IIS 6.0 on Server 2003, another CVE-2017-7269 path — but the stock exploit settings that worked on Grandpa fail here. The box exists to teach the skill that separates script-runners from exploit operators: reading and retargeting exploit code.',
      'Same recon (IIS 6.0 banner, WebDAV enabled), same module (iis_webdav_scstoragepathfromurl) — different result: the default target crashes the service instead of returning a shell. The fix is in the module options and the payload choice: select the matching target profile, switch to a payload that fits the overflow constraints (a smaller staged or non-staged payload), and the same overflow lands cleanly as SYSTEM.',
      'Flags fall in the single SYSTEM session, same layout as Grandpa. (Values redacted per HTB rules; earn them in your own lab.) The real flag here is methodological: when an exploit fails on a confirmed-vulnerable target, the answer is targeting and payloads, not a different vulnerability.',
      'Dead ends I hit so you do not have to: re-running the identical Grandpa settings five times hoping for luck (exploits are deterministic — change a variable, do not pray) and blaming the VPN (verify with a manual PROPFIND probe that WebDAV actually responds first).',
      'Remediation notes: identical to Grandpa — retire the stack — plus the operator lesson for defenders: one patch gap, two boxes, same root cause. Asset inventory catches both at once.',
      'Next in this series: more retired-machine walkthroughs. Written by Lucky Thandel.',
    ],
  },
  {
    slug: 'htb-valentine-heartbleed-tmux',
    title: 'HTB Valentine: Heartbleed memory theft and a root tmux session',
    tag: 'retired-machine',
    date: '2026-10-10',
    level: 'easy',
    summary:
      'Bleed an old OpenSSL heartbeat (CVE-2014-0160) for an SSH key and passphrase, then attach a root-owned tmux session left lying around.',
    body: [
      'Valentine is a retired HackTheBox easy Linux machine built from two famous leftovers: a Heartbleed-vulnerable HTTPS service and a root tmux session attached to a world-accessible socket. nmap shows HTTP/HTTPS on an older Linux; the TLS certificate and an old OpenSSL version string point at CVE-2014-0160 before any exploit runs.',
      'Foothold via Heartbleed: run a heartbleed exploit script against the HTTPS port and sift the leaked 64KB memory chunks. Among the garbage sit an SSH private key and its passphrase in the clear — decode, save with strict permissions, and SSH in as the hype user. Memory-disclosure bugs turn the server into an oracle; patience with the dump pays.',
      'Privilege escalation via tmux: enumeration shows a tmux socket owned by root that your user can attach to (tmux -S <socket> attach). The session is a live root shell someone left running — attach and you are root with no exploit at all. Shared-session hygiene matters: sockets are permissions too.',
      'Flags: user.txt in the hype home directory, root.txt in /root. (Values redacted per HTB rules; earn them in your own lab.)',
      'Dead ends I hit so you do not have to: bleeding once and giving up (key material appears across many dumps — collect several and grep) and mis-setting key file permissions (SSH refuses keys readable by others — chmod 600 first).',
      'Remediation notes: patch OpenSSL past Heartbleed everywhere including appliances, rotate any credentials that lived in process memory, and never leave root sessions on shared sockets — kill idle privileged sessions automatically.',
      'Next in this series: more retired-machine walkthroughs. Written by Lucky Thandel.',
    ],
  },
  {
    slug: 'htb-arctic-coldfusion-traversal',
    title: 'HTB Arctic: ColdFusion traversal to admin to SYSTEM',
    tag: 'retired-machine',
    date: '2026-10-11',
    level: 'easy',
    summary:
      'Adobe ColdFusion 8 directory traversal (CVE-2010-2861) leaks the admin hash, the admin console schedules a CFM shell, and the service is SYSTEM.',
    body: [
      'Arctic is a retired HackTheBox easy Windows machine centered on Adobe ColdFusion 8 — enterprise middleware of a certain era, full of classic flaws. nmap shows HTTP on Server 2008 with /CFIDE/ paths all over the site. The version plus the /CFIDE/administrator/ surface is the whole recon story: ColdFusion 8 means CVE-2010-2861.',
      'Foothold via directory traversal: the administrator login page is vulnerable to .../ traversal that reads password.properties, exposing the admin password hash. Crack it (or pass it per the era-appropriate technique), log into the ColdFusion administrator console, and use the scheduled-task feature to execute a malicious CFM file — a webshell with the full ColdFusion API behind it.',
      'No privesc needed: the ColdFusion service runs as SYSTEM, so the scheduled CFM shell lands at the top of the privilege ladder and both flags fall immediately. (Values redacted per HTB rules; earn them in your own lab.)',
      'Dead ends I hit so you do not have to: attacking the IIS layer (the web server is fine — the middleware is the vulnerability, fingerprint the app not just the server) and writing a complex CFM payload first (start with a simple command-execution tag to prove code exec, then upgrade to a full shell).',
      'Remediation notes: retire ColdFusion 8 (long end-of-life), run application services as dedicated low-privilege accounts, and lock admin consoles behind network controls — an admin panel reachable by everyone is a matter of time.',
      'Next in this series: more retired-machine walkthroughs. Written by Lucky Thandel.',
    ],
  },
  {
    slug: 'htb-chatterbox-achat-potato',
    title: 'HTB Chatterbox: AChat overflow and Juicy Potato to SYSTEM',
    tag: 'retired-machine',
    date: '2026-10-12',
    level: 'easy',
    summary:
      'A chat server with a classic buffer overflow plus SeImpersonatePrivilege: the exact recipe Juicy Potato was made for.',
    body: [
      'Chatterbox is a retired HackTheBox easy Windows machine that pairs two textbook techniques. nmap shows an unusual high port running AChat 0.150 beta7 — a small chat server — alongside standard Windows ports. Niche network services with old versions are always worth fingerprinting twice.',
      'Foothold: AChat 0.150 beta7 has a public stack buffer overflow in its username handling (see EDB 36025, mirrored by Metasploit module exploit/windows/misc/achat_bof). Point the module at the chat port, and the overflow returns a shell as the low-privilege Alfred user.',
      'Privilege escalation: whoami /priv shows SeImpersonatePrivilege — the token-impersonation right that makes Juicy Potato possible. Upload JuicyPotato, pick a working CLSID for the OS build, and trigger it to clone a SYSTEM token into your shell. Service accounts with impersonation rights are a standing SYSTEM-equivalent.',
      'Flags: user.txt in the Alfred profile, root.txt with the Administrators. (Values redacted per HTB rules; earn them in your own lab.)',
      'Dead ends I hit so you do not have to: fuzzing HTTP first (the web server is decoration — the chat port is the attack surface, so scan all 65k and read every banner) and trying kernel exploits before checking privileges (whoami /priv takes five seconds and names the exact potato path).',
      'Remediation notes: retire abandonware network services, strip SeImpersonatePrivilege from service accounts that do not need it, and monitor for the classic potato indicators (rogue COM activations plus new SYSTEM processes).',
      'Next in this series: more retired-machine walkthroughs. Written by Lucky Thandel.',
    ],
  },
  {
    slug: 'htb-jeeves-jenkins-keepass',
    title: 'HTB Jeeves: open Jenkins console, cracked KeePass, hash to admin',
    tag: 'retired-machine',
    date: '2026-10-13',
    level: 'easy',
    summary:
      'Unauthenticated Jenkins script console to foothold, a KeePass vault cracked with john, and an NTLM hash walked straight to Administrator.',
    body: [
      'Jeeves is a retired HackTheBox easy Windows machine themed around askjeeves-era enterprise software: IIS, SMB, and a Jenkins automation server with its script console exposed. nmap plus a quick browse finds Jenkins listening — and the Script Console reachable without login. CI consoles are high-value targets: they execute code by design.',
      'Foothold: the Jenkins Script Console runs arbitrary Groovy as the kohsuke service user. A Groovy reverse-shell one-liner plus a local listener gives a working shell. No CVE needed — this is intended functionality left facing the network, which is why exposed CI is a finding, not a feature.',
      'Lateral data: enumeration of the kohsuke home directory turns up CEH.kdbx — a KeePass password vault. Exfiltrate it, run keepass2john to extract the hash, crack it against rockyou, and the vault opens to reveal an Administrator NTLM hash. Credential vaults on-disk are only as safe as their master passwords.',
      'Finish: pass-the-hash to the Administrator account (psexec or evil-winrm style) and both flags fall. user.txt and root.txt per the usual layout. (Values redacted per HTB rules; earn them in your own lab.)',
      'Dead ends I hit so you do not have to: attacking IIS and SMB first (enumerate everything, but the Jenkins console is the glowing door — check unauthenticated access on every management UI early) and trying to crack the hash before the vault (order matters: vault first, then hash).',
      'Remediation notes: authenticate and network-restrict CI consoles, never store vaults on shared hosts with weak master passwords, and treat any NTLM hash exposure as full compromise — rotate, do not just re-lock.',
      'Next in this series: more retired-machine walkthroughs. Written by Lucky Thandel.',
    ],
  },
  {
    slug: 'htb-help-helpdeskz-upload',
    title: 'HTB Help: HelpDeskZ upload RCE and a kernel ride to SYSTEM',
    tag: 'retired-machine',
    date: '2026-10-14',
    level: 'easy',
    summary:
      'HelpDeskZ 1.0.2 lets anonymous users upload PHP through support tickets — then an old kernel flaw finishes the climb to SYSTEM.',
    body: [
      'Help is a retired HackTheBox easy Windows machine built on HelpDeskZ 1.0.2, a small support-ticket app on IIS. The ticket-submission form accepts file attachments with weak validation — and the uploaded files land in a web-accessible directory. Support portals that take attachments are file-upload attack surface wearing a helpdesk costume.',
      'Foothold: submit a ticket with a PHP webshell attached (the classic HelpDeskZ upload bypass, automated by Metasploit module exploit/unix/webapp/helpdeskz_upload_exec). Browse to the uploaded file, catch the callback, and you land as the low-privilege web user.',
      'Privilege escalation: Windows Server 2012 era plus a low-privileged shell means checking kernel flaws — local_exploit_suggester points at MS15-051 (the client-copy-image impersonation bug). The Metasploit MS15-051 module elevates the session to NT AUTHORITY\\SYSTEM and both flags fall. (Values redacted per HTB rules; earn them in your own lab.)',
      'Dead ends I hit so you do not have to: testing SQL injection on the ticket form for an hour (the upload is the vulnerability — when a form takes files, test the files first) and running potato exploits before the kernel suggester (match the privesc to the OS generation).',
      'Remediation notes: validate uploads by content and store them outside the web root (or without script execution), patch kernel escalation flaws on cadence, and treat every file-accepting endpoint as untrusted-input surface.',
      'Next in this series: more retired-machine walkthroughs. Written by Lucky Thandel.',
    ],
  },
  {
    slug: 'htb-traverxec-nostromo-sudo',
    title: 'HTB Traverxec: nostromo RCE, a backup key, and journalctl to root',
    tag: 'retired-machine',
    date: '2026-10-15',
    level: 'easy',
    summary:
      'nostromo 1.9.6 homedir escape (CVE-2019-16278), SSH keys hiding in a backup archive, and a sudo journalctl pager escape for root.',
    body: [
      'Traverxec is a retired HackTheBox easy Linux machine serving websites with nostromo 1.9.6 (nhttpd) — a rare server whose version string maps to exactly one famous bug. nmap shows the web port; the Server header says nostromo 1.9.6, which is CVE-2019-16278: a homedir-escape RCE via crafted requests. Rare software, public exploit, short path.',
      'Foothold: the public nostromo exploit abuses the homedir path handling to execute commands, returning a shell as the dawid service user. Verify the CVE against the banner first — when version and exploit agree this cleanly, run it.',
      'Lateral move: the dawid home hides a backup archive of SSH identity files plus a protected web directory whose credentials sit in the nostromo config (.htpasswd). Combine the two — credentials plus recovered key material — to SSH in as the fuller david user.',
      'Privilege escalation: sudo -l shows journalctl runnable as root — and journalctl pages through less. From the pager, !/bin/sh escapes to a root shell. Sudo on any pager, editor, or interpreter is root by another name; the GTFOBins entry for this pattern is worth memorizing.',
      'Flags: user.txt in the david home directory, root.txt in /root. (Values redacted per HTB rules; earn them in your own lab.)',
      'Dead ends I hit so you do not have to: brute-forcing the protected web directory (its credential is already on disk in the server config — enumerate files before passwords) and overlooking the backup archive (backup files are credential storage until proven otherwise).',
      'Remediation notes: patch or replace rare/legacy web servers, keep SSH keys out of backups (or encrypt the backups), and audit sudo rules against GTFOBins — pager escapes are a classic finding for a reason.',
      'Next in this series: more retired-machine walkthroughs. Written by Lucky Thandel.',
    ],
  },
  {
    slug: 'htb-getting-started',
    title: 'How I approach a new HTB machine: my repeatable checklist',
    tag: 'methodology',
    date: '2026-09-20',
    level: 'beginner',
    summary:
      'My standard flow — scope, enumeration, foothold, privilege escalation — and the notes template I use so no finding gets lost.',
    body: [
      'Every machine starts the same way: scope the target, enumerate methodically, and take notes as if you will publish them — because here, we do.',
      '1. Recon: nmap -sC -sV -p- with a targeted second pass. 2. Web/SMB enumeration: gobuster, nikto, smbclient, enum4linux. 3. Foothold: match versions to known issues, test manually before running exploits. 4. Privilege escalation: sudo -l, SUID binaries, cron jobs, writable paths, then LinPEAS/WinPEAS for the second pass.',
      'The full checklist and notes template ship with each write-up so beginners can repeat the process on any easy machine.',
    ],
  },
  {
    slug: 'htb-enumeration-notes',
    title: 'Enumeration notes: nmap, SMB, web fuzzing without the noise',
    tag: 'enumeration',
    date: '2026-09-15',
    level: 'beginner',
    summary:
      'The small set of enumeration commands that cover most easy machines, plus how I record results for the write-up.',
    body: [
      'Enumeration is where easy machines are won. A small, repeatable command set beats a large random one.',
      'nmap -sC -sV --min-rate 5000 for services, gobuster dir -u http://target -w common wordlist for web paths, smbclient -L and enum4linux for SMB shares. Record every open port, version, and finding in a table before moving to exploitation.',
      'Rule: no exploitation until the enumeration table is complete. Write-ups on this site follow that order.',
    ],
  },
  {
    slug: 'htb-privesc-basics',
    title: 'Linux privilege escalation basics I check first',
    tag: 'privesc',
    date: '2026-09-10',
    level: 'beginner',
    summary:
      'sudo, SUID, cron, writable paths — the first-pass checks before reaching for heavier tooling.',
    body: [
      'First-pass privilege escalation is manual and fast: sudo -l, find / -perm -4000 for SUID, crontab -l and /etc/cron* for scheduled jobs, and writable PATH/service checks.',
      'Only after the manual pass do I run LinPEAS for confirmation. Each check maps to a safe, documented technique — no kernel exploits on shared lab machines.',
      'Every write-up closes with remediation notes: least privilege, patch cadence, and what the defender should log.',
    ],
  },
]

export const posts: Post[] = [
  {
    slug: 'why-write-ups',
    title: 'Why I publish write-ups: learning in public',
    tag: 'blog',
    date: '2026-09-25',
    summary:
      'Writing forces clarity. How publishing HTB and CTF notes improves retention and helps others entering infosec.',
    body: [
      'Publishing notes turns a solved machine into durable skill. Explaining each step exposes gaps that solving alone hides.',
      'This site keeps write-ups beginner-friendly: commands shown, dead ends included, remediation noted. Learning in public helps the next person and keeps me honest.',
    ],
  },
  {
    slug: 'ctf-starter-kit',
    title: 'My CTF starter kit: tools, wordlists, and mindset',
    tag: 'ctf',
    date: '2026-09-18',
    summary:
      'A minimal, free toolkit for CTF beginners — and the habits that matter more than any tool.',
    body: [
      'Starter kit: nmap, Burp Community, gobuster/ffuf, SecLists common wordlists, Python3, and Obsidian for notes.',
      'Mindset beats tooling: enumerate first, document everything, timebox rabbit holes, and always capture flags with screenshots for the write-up.',
    ],
  },
  {
    slug: 'staying-current',
    title: 'Staying current in cybersecurity without drowning',
    tag: 'news',
    date: '2026-09-12',
    summary:
      'A short list of feeds and a weekly routine for keeping up with news, CVEs, and techniques.',
    body: [
      'Weekly routine: vendor advisories, CISA KEV catalog, and one technique deep-dive per week tied to a lab machine.',
      'The News page on this site distills notable items into short, sourced briefs with defender takeaways.',
    ],
  },
]

export const news: Post[] = [
  {
    slug: 'weekly-2026-09-27',
    title: 'Weekly brief: patch Tuesday notes and lab focus',
    tag: 'weekly',
    date: '2026-09-27',
    summary: 'What I am tracking this week and which lab techniques pair with it.',
    body: [
      'This week: review vendor patch notes, cross-check CISA KEV additions, and map one item to a lab exercise.',
      'Defender takeaway: prioritize internet-facing services first, then validate backups and detection coverage for the patched vectors.',
    ],
  },
  {
    slug: 'cve-hygiene',
    title: 'CVE hygiene: a short routine that actually sticks',
    tag: 'defense',
    date: '2026-09-14',
    summary: 'A five-step weekly loop for triaging CVEs without alert fatigue.',
    body: [
      'Inventory exposed services, filter by exploitability (KEV/EPSS), patch in severity order, verify with a rescan, and log decisions.',
      'Small teams win by shrinking scope: known-exploited first, everything else on cadence.',
    ],
  },
]

export const research: Post[] = [
  {
    slug: 'honeypot-diaries',
    title: 'Honeypot diaries: 48 hours of SSH brute-force logs',
    tag: 'threat-intel',
    date: '2026-09-26',
    summary:
      'I pointed a Cowrie honeypot at the internet for a weekend. Here are the weirdest login attempts, the most-patient botnets, and what defenders should log.',
    body: [
      'A low-interaction SSH honeypot on a cloud VM collected over 12,000 login attempts in 48 hours. Most were spray-and-pray root/admin tries, but a handful were strange: slow, low-volume attempts cycling through IoT vendor defaults — the patient kind that evades fail2ban thresholds.',
      'Top credential pairs, ASN clustering, and timing analysis are all in my notes. The key defender takeaway: ban on ASN + behavior, not just IP, and alert on successful logins from never-before-seen autonomous systems.',
      'All research was conducted on infrastructure I own, with the honeypot isolated from production networks. Logs are anonymized before publication.',
    ],
  },
  {
    slug: 'evil-twin-next-door',
    title: 'Evil twins next door: mapping rogue Wi-Fi beacons in my building',
    tag: 'wireless',
    date: '2026-09-21',
    summary:
      'Passive Wi-Fi survey of my apartment block turned up copycat SSIDs and a deauth-happy neighbor. How I mapped it without transmitting a thing.',
    body: [
      'Using a monitor-mode adapter in fully passive capture, I logged beacon frames across 2.4 and 5 GHz for a week. Two SSIDs mimicked the building ISP default naming with slightly stronger signal — classic evil-twin positioning near the lobby.',
      'Methodology: Kismet for capture, signal-strength triangulation by walking floors, and OUI lookups to fingerprint AP vendors. No deauthentication, no association, no interaction with any network I do not own.',
      'Defender takeaway: enterprises should baseline BSSID + OUI + signal geography; anything new and loud near the entrance deserves a look.',
    ],
  },
  {
    slug: 'prefetch-tales',
    title: 'Prefetch tales: what Windows told me about my own malware lab',
    tag: 'forensics',
    date: '2026-09-16',
    summary:
      'I detonated commodity samples in an isolated VM, then read the story back through Prefetch, Shimcache, and Amcache. Artifacts do not lie.',
    body: [
      'In an air-gapped analysis VM, I executed two commodity droppers and snapshotted the disk. Prefetch gave execution counts and last-run times, Shimcache preserved deleted binaries, and Amcache filled in file paths and SHA-1s the samples tried to hide.',
      'The full artifact walkthrough — tools, parsers, and timeline assembly — is written so a beginner can repeat it on any lab image.',
      'Safety note: samples never left the isolated VM, and hashes are shared so defenders can hunt, not so anyone can rebuild.',
    ],
  },
]

export const allPosts: Post[] = [...writeups, ...posts, ...news, ...research]

export function findPost(slug: string): Post | undefined {
  return allPosts.find((p) => p.slug === slug)
}

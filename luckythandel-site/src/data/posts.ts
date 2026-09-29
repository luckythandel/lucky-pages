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

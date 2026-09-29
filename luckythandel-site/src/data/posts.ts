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

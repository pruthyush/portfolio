// Theme Toggle & State Persistence
(function initTheme() {
  const htmlEl = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const toggleIcon = document.getElementById('theme-toggle-icon');
  const toggleLabel = document.getElementById('theme-toggle-label');

  function applyTheme(isDark) {
    if (isDark) {
      htmlEl.classList.add('dark');
      document.body.style.backgroundColor = '#121110';
      document.body.style.color = '#ece8e1';
      if (toggleIcon) toggleIcon.textContent = 'dark_mode';
      if (toggleLabel) toggleLabel.textContent = 'Dark';
      localStorage.setItem('theme', 'dark');
    } else {
      htmlEl.classList.remove('dark');
      document.body.style.backgroundColor = '#fbf9f4';
      document.body.style.color = '#1b1c19';
      if (toggleIcon) toggleIcon.textContent = 'light_mode';
      if (toggleLabel) toggleLabel.textContent = 'Light';
      localStorage.setItem('theme', 'light');
    }
  }

  // Check saved theme preference or default to dark mode
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    applyTheme(false);
  } else {
    applyTheme(true);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      const isCurrentlyDark = htmlEl.classList.contains('dark');
      applyTheme(!isCurrentlyDark);
    });
  }
})();

// Toast Notification System
function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed bottom-6 right-6 z-50 bg-[#1a1918] dark:bg-[#1a1918] text-[#ece8e1] border border-white/20 px-4 py-3 rounded-sm font-mono text-xs shadow-2xl flex items-center gap-3 transition-all transform translate-y-10 opacity-0 pointer-events-none';
    toast.innerHTML = `<span class="w-2 h-2 rounded-full bg-[#4ade80] animate-ping"></span><span id="toast-message"></span>`;
    document.body.appendChild(toast);
  }

  const messageEl = toast.querySelector('#toast-message');
  if (messageEl) messageEl.textContent = message;

  toast.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none');
  }, 3000);
}

// Copy to Clipboard Utility
function copyToClipboard(text, label) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied ${label} (${text}) to clipboard!`);
    }).catch(err => {
      fallbackCopyTextToClipboard(text, label);
    });
  } else {
    fallbackCopyTextToClipboard(text, label);
  }
}

function fallbackCopyTextToClipboard(text, label) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`Copied ${label} (${text}) to clipboard!`);
  } catch (err) {
    showToast(`Failed to copy ${label}`);
  }
  document.body.removeChild(textArea);
}

// Interactive Terminal Simulator in Hero
document.addEventListener('DOMContentLoaded', () => {
  const termInput = document.getElementById('terminal-input');
  const termOutput = document.getElementById('terminal-output');

  if (termInput && termOutput) {
    const commands = {
      'help': `Available CLI Commands:
  • summary    - Print professional VAPT summary
  • autosec    - Inspect AutoSec-Framework architecture details
  • ctf        - View CTF accomplishments & platform stats
  • skills     - Print core security tools & technologies
  • contact    - Display secure channel contact details
  • clear      - Clear terminal window`,
      
      'summary': `[PRUTHYUSH A S] - Cybersecurity Graduate & VAPT Specialist
• MCA Cybersecurity (Pursuing 2025-2027) @ Jain University, Kochi
• Hands-on VAPT internship building AI-driven pen testing platforms
• Experienced in OWASP Top 10, DAST, Nuclei, OWASP ZAP, Burp Suite
• 20+ CTF challenges solved across PicoCTF, THM, HTB, OverTheWire
• Seeking entry-level Cybersecurity Analyst / VAPT roles (Immediate)`,

      'autosec': `[PROJECT: AutoSec-Framework]
• Autonomous, AI-Driven Penetration Testing Platform
• Built with FastAPI, Docker, OWASP ZAP, Nuclei, & Google Gemini
• Features 7-stage Python pipeline & <10% false-positive deduplication
• Automated CVSS risk scoring & PDF Security Assessment Report generation`,

      'ctf': `[CTF & SECURITY LAB ACCOMPLISHMENTS]
• 🏆 3rd Place - CTF Competition @ JAIN University (ISRA Kochi)
• 🚩 24-Hour CTF Participant @ Rajagiri School of Engineering & Tech
• 🧩 20+ Solved Challenges (PicoCTF, TryHackMe, HackTheBox, OverTheWire)
• 📜 Cisco - Introduction to Cybersecurity Certification Badge`,

      'skills': `[TECHNICAL SKILLS MATRIX]
• Security Tools : Nuclei, OWASP ZAP, Burp Suite, CVSS, Security Headers
• AppSec & DAST  : OWASP Top 10, API Security Top 10, Authentication
• SysAdmin & OS  : Kali Linux, Ubuntu, Fedora, Windows Administration
• Code & Networking: Python, FastAPI, SQLAlchemy, Docker, Cisco Packet Tracer`,

      'contact': `[DIRECT CHANNELS]
• Email    : aspruthyush@gmail.com
• Phone    : +91 9846815669
• Location : Ernakulam, Kerala, India
• GitHub   : github.com/pruthyush
• LinkedIn : linkedin.com/in/pruthyushas`
    };

    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = termInput.value.trim().toLowerCase();
        termInput.value = '';

        const line = document.createElement('div');
        line.className = 'text-[#ece8e1] font-mono text-[11px] mb-1';
        line.innerHTML = `<span class="text-[#4ade80]">pruthyush@sec-lab:~$</span> ${cmd}`;
        termOutput.appendChild(line);

        if (cmd === 'clear') {
          termOutput.innerHTML = '';
          return;
        }

        const response = document.createElement('div');
        response.className = 'text-[#9a968f] font-mono text-[11px] mb-3 whitespace-pre-wrap leading-relaxed pl-2 border-l border-white/10';

        if (commands[cmd]) {
          response.textContent = commands[cmd];
        } else if (cmd === '') {
          return;
        } else {
          response.textContent = `Command not recognized: '${cmd}'. Type 'help' for available commands.`;
          response.className += ' text-[#f87171]';
        }

        termOutput.appendChild(response);
        termOutput.scrollTop = termOutput.scrollHeight;
      }
    });
  }

  // Smooth Scroll for Internal Nav Anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth'
        });
        // Close mobile drawer if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
});

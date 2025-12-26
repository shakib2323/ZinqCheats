// --- SECURITY & ANTI-FORENSICS MODULE ---

const SecurityShield = {
    init: function(userUid) {
        this.uid = userUid;
        this.preventInspect();
        this.detectCapture();
    },

    preventInspect: function() {
        // Disable Right Click
        document.addEventListener('contextmenu', event => event.preventDefault());
        
        // Disable F12, Ctrl+Shift+I, etc.
        document.onkeydown = function(e) {
            if(e.keyCode == 123 || (e.ctrlKey && e.shiftKey && e.keyCode == 73)) return false;
        };
    },

    detectCapture: function() {
        // Detect PrintScreen
        window.addEventListener('keyup', (e) => {
            if (e.key === 'PrintScreen') {
                this.triggerAutoBan("Screenshot Attempt Detected");
            }
        });

        // Detect Focus Loss (often happens when starting screen recording)
        window.onblur = () => {
            document.getElementById('privacy-shield').style.display = 'flex';
        };
        window.onfocus = () => {
            document.getElementById('privacy-shield').style.display = 'none';
        };
    },

    triggerAutoBan: function(reason) {
        const idKey = this.uid.replace(/-/g, "");
        db.ref('blacklist/' + idKey).set({
            type: "perm",
            reason: reason,
            timestamp: Date.now()
        }).then(() => {
            alert("SECURITY VIOLATION: You have been permanently banned.");
            localStorage.clear();
            location.reload();
        });
    }
};
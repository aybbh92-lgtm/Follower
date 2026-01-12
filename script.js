// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when a link is clicked
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-md');
            navbar.classList.replace('bg-white/90', 'bg-white');
        } else {
            navbar.classList.remove('shadow-md');
            navbar.classList.replace('bg-white', 'bg-white/90');
        }
    });

    // Service Selection Logic
    window.selectService = function(serviceName) {
        const select = document.getElementById('serviceSelect');
        if (select) {
            select.value = serviceName;
            // Scroll to contact section
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }
    };
    // Form Submission Logic
    const form = document.getElementById('orderForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get values from form
        const name = form.querySelector('input[type="text"]').value.trim();
        const phone = form.querySelector('input[type="tel"]').value.trim();
        const service = document.getElementById('serviceSelect').value;
        const url = form.querySelector('input[type="url"]').value.trim();
        const notes = form.querySelector('textarea').value.trim();

        // Validation
        if(!name || !phone) {
            Swal.fire({
                icon: 'warning',
                title: 'تنبيه',
                text: 'يرجى تعبئة الاسم ورقم الهاتف للتواصل.',
                confirmButtonColor: '#4f46e5'
            });
            return;
        }

        // --- Step 1: Send Email to aybbh92@gmail.com ---
        // استبدل الرابط أدناه برابط Formspree الخاص بك
        // للتفعيل: 1. اذهب إلى formspree.io  2. أنشئ حساباً مجانياً  3. أنشئ فورم جديد  4. انسخ الـ URL وضعه هنا
        const formSpreeUrl = 'https://formspree.io/f/your_form_id_here'; 

        const formData = {
            'الاسم': name,
            'الهاتف': phone,
            'الخدمة': service,
            'الرابط': url,
            'الملاحظات': notes
        };

        // Try to send email in background
        fetch(formSpreeUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => {
            // Email sent (or simulated), proceed to WhatsApp
            sendToWhatsApp(name, phone, service, url, notes);
        })
        .catch(error => {
            // If email fails (e.g. ID not set), still proceed to WhatsApp to ensure contact
            console.log('Email service not configured or failed, redirecting to WhatsApp.');
            sendToWhatsApp(name, phone, service, url, notes);
        });
    });

    // Function to handle WhatsApp redirection
    function sendToWhatsApp(name, phone, service, url, notes) {
        // Construct WhatsApp Message with emojis and formatting
        const message = `🛒 *طلب جديد من SocialGrowth*\n\n` +
                        `━━━━━━━━━━━━━━━━━━\n` +
                        `👤 *الاسم:* ${name}\n` +
                        `📞 *الهاتف:* ${phone}\n` +
                        `🛠️ *الخدمة:* ${service}\n` +
                        `🔗 *الرابط:* ${url || 'لم يتم إدخال رابط'}\n` +
                        `📝 *الملاحظات:* ${notes || 'لا توجد ملاحظات'}\n` +
                        `━━━━━━━━━━━━━━━━━━\n` +
                        `🕐 *تاريخ الطلب:* ${new Date().toLocaleString('ar-SA')}`;

        // WhatsApp API URL
        const waBaseLink = "https://wa.me/message/67UKGLPZLH5VM1";
        const waLink = `${waBaseLink}?text=${encodeURIComponent(message)}`;

        // Show success message
        Swal.fire({
            icon: 'success',
            title: 'تم إرسال الطلب بنجاح! ✅',
            text: 'جاري توجيهك للواتساب...',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            // Open WhatsApp
            window.open(waLink, '_blank');
            form.reset();
        });
    }
// Intersection Observer for Fade-in Animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.service-card, .feature-card');
    animatedElements.forEach(el => {
        el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
        observer.observe(el);
    });
});
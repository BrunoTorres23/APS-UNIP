document.addEventListener('DOMContentLoaded', function () {
  // Accordion functionality
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', function () {
      const accordionItem = this.parentElement;
      const content = this.nextElementSibling;
      const icon = this.querySelector('i');

      // Toggle active class
      accordionItem.classList.toggle('active');

      // Toggle icon
      if (icon.classList.contains('bi-chevron-down')) {
        icon.classList.replace('bi-chevron-down', 'bi-chevron-up');
      } else {
        icon.classList.replace('bi-chevron-up', 'bi-chevron-down');
      }

      // Toggle content visibility
      if (accordionItem.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  });

  // Tabs functionality
  const tabButtons = document.querySelectorAll('.tab-btn');

  tabButtons.forEach(button => {
    button.addEventListener('click', function () {
      // Remove active class from all buttons and panels
      tabButtons.forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

      // Add active class to clicked button
      this.classList.add('active');

      // Show corresponding panel
      const tabId = this.getAttribute('data-tab');
      document.getElementById(tabId + '-panel').classList.add('active');
    });
  });

  // Initialize accordion content max-height
  document.querySelectorAll('.accordion-content').forEach(content => {
    content.style.maxHeight = '0';
    content.style.overflow = 'hidden';
    content.style.transition = 'max-height 0.3s ease';
  });
});
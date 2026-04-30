/**
 * ロードされたらfooter.htmlを探し、footerタグに挿入
 */
window.addEventListener('DOMContentLoaded', () => {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('footer').innerHTML = data;
        });
});
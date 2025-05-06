document.addEventListener('DOMContentLoaded', function() {
    // 获取所有可折叠部分
    const sections = document.querySelectorAll('.collapsible-section');
    
    // 为每个部分添加点击事件
    sections.forEach(section => {
        const header = section.querySelector('.collapsible-header');
        const content = section.querySelector('.collapsible-content');
        const icon = header.querySelector('.toggle-icon');
        
        // 初始状态：所有内容都是隐藏的
        content.style.display = 'none';
        icon.textContent = '▼';
        
        // 点击标题时切换内容显示状态
        header.addEventListener('click', () => {
            const isExpanded = content.style.display === 'block';
            
            // 切换显示状态
            content.style.display = isExpanded ? 'none' : 'block';
            
            // 更新图标
            icon.textContent = isExpanded ? '▼' : '▲';
            
            // 添加/移除展开状态类
            if (isExpanded) {
                header.classList.remove('expanded');
            } else {
                header.classList.add('expanded');
            }
        });
    });
    
    // 处理URL锚点
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash).closest('.collapsible-section');
        if (targetSection) {
            targetSection.classList.add('active');
            const content = targetSection.querySelector('.collapsible-content');
            // 确保内容在展开时正确渲染
            content.style.display = 'none';
            content.offsetHeight; // 触发重排
            content.style.display = '';
        }
    }
}); 
// Blog articles data - This connects your blog to your admin panel
const articles = [];

function searchArticles(query) {
    const lowercaseQuery = query.toLowerCase();
    return articles.filter(article => 
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.excerpt.toLowerCase().includes(lowercaseQuery) ||
        article.content.toLowerCase().includes(lowercaseQuery) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
    );
}

function getArticleStats() {
    const total = articles.length;
    const published = articles.filter(a => a.status === 'published').length;
    const drafts = articles.filter(a => a.status === 'draft').length;
    const archived = articles.filter(a => a.status === 'archived').length;
    const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
    const totalLikes = articles.reduce((sum, a) => sum + (a.likes || 0), 0);
    const totalComments = articles.reduce((sum, a) => sum + (a.comments || 0), 0);

    return {
        total,
        published,
        drafts,
        archived,
        totalViews,
        totalLikes,
        totalComments
    };
}

export { articles as a, getArticleStats as g, searchArticles as s };

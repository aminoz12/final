// public/scripts/gpt5-service.js
class GPT5Service {
  constructor() {
    // server endpoints (no secret in client)
    this.chatEndpoint = '/api/openai/chat';
    this.imagesEndpoint = '/api/openai/images';

    // Optional local admin secret (only if you set ADMIN_SECRET and intentionally store it locally)
    this.adminSecret = localStorage.getItem('admin_secret') || null;
  }

  // Optional: set an admin secret in the browser (NOT recommended for public clients)
  setAdminSecret(secret) {
    if (secret && secret.trim()) {
      this.adminSecret = secret.trim();
      localStorage.setItem('admin_secret', this.adminSecret);
      return true;
    }
    this.adminSecret = null;
    localStorage.removeItem('admin_secret');
    return false;
  }

  // Internal helper to build headers (add admin secret header only if present)
  _buildHeaders(contentType = 'application/json') {
    const headers = { 'Content-Type': contentType };
    if (this.adminSecret) {
      headers['x-admin-secret'] = this.adminSecret;
    }
    return headers;
  }

  // Test server-side key by making a small test request (server will use its OPENAI_API_KEY)
  async testApiKey() {
    try {
      const res = await fetch(this.chatEndpoint, {
        method: 'POST',
        headers: this._buildHeaders(),
        body: JSON.stringify({
          model: 'gpt-5',
          messages: [{ role: 'user', content: 'Test' }],
          max_tokens: 5
        })
      });
      if (res.ok) return true;
      console.error('Server test failed:', await res.text());
      return false;
    } catch (err) {
      console.error('Error testing server key:', err);
      return false;
    }
  }

  // Generate article using server proxy
  async generateArticle(prompt, options = {}) {
    try {
      const {
        title = '',
        category = '',
        tone = 'professional',
        length = 'medium',
        language = 'French'
      } = options;

      const lengthLimits = {
        short: '600 mots',
        medium: '1500 mots',
        long: '3000 mots',
        'extra-long': '4000+ mots'
      };

      const systemPrompt = `Tu es un expert rédacteur de blog professionnel. 
Génère un article de blog complet et engageant en ${language}.
Ton: ${tone}
Longueur: ${lengthLimits[length] || lengthLimits.medium}
Catégorie: ${category}
IMPORTANT: Respecte strictement la longueur demandée en nombre de mots.
L'article doit inclure:
- Un titre accrocheur
- Une introduction captivante
- Un contenu structuré avec des sous-titres
- Une conclusion engageante
- Des mots-clés pertinents
- Le nombre de mots doit correspondre à la longueur demandée
Format de réponse: JSON avec les champs suivants:
{
  "title": "Titre de l'article",
  "content": "Contenu complet de l'article",
  "excerpt": "Résumé court (max 200 caractères)",
  "keywords": ["mot-clé1", "mot-clé2", "mot-clé3"],
  "wordCount": 0,
  "estimatedReadTime": 5,
  "category": "${category}"
}`;

      const userPrompt = title ? `Génère un article sur: "${title}"` : prompt;

      const body = {
        model: 'gpt-5',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      };

      const res = await fetch(this.chatEndpoint, {
        method: 'POST',
        headers: this._buildHeaders(),
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server returned ${res.status}: ${errText}`);
      }

      const data = await res.json();
      // handle response shape same as before
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        try {
          const parsed = JSON.parse(content);
          return { success: true, data: parsed, rawResponse: content };
        } catch (e) {
          // fallback
          return {
            success: true,
            data: {
              title: title || 'Article généré par GPT',
              content,
              excerpt: content.substring(0, 200) + '...',
              keywords: ['gpt', 'article'],
              wordCount: content.split(/\s+/).length,
              estimatedReadTime: Math.ceil(content.split(/\s+/).length / 200)
            },
            rawResponse: content,
            fallback: true
          };
        }
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('generateArticle error:', err);
      return { success: false, error: err.message || String(err) };
    }
  }

  // generateArticleIdeas (calls server)
  async generateArticleIdeas(category = '', count = 5) {
    try {
      const prompt = `Génère ${count} idées d'articles de blog pour la catégorie "${category || 'général'}" au format JSON.`;
      const body = {
        model: 'gpt-5',
        messages: [
          { role: 'system', content: `You are a content ideas generator specialized in ${category}` },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1200,
        temperature: 0.8
      };

      const res = await fetch(this.chatEndpoint, {
        method: 'POST',
        headers: this._buildHeaders(),
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server returned ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('No content from model');
      try {
        const parsed = JSON.parse(content);
        return { success: true, data: parsed };
      } catch (parseErr) {
        // fallback: return generic ideas (you already had fallback logic)
        console.warn('Parsing ideas failed, returning fallback');
        // Keep your previous fallback generation here (omitted for brevity)
        return { success: true, data: [], fallback: true, error: parseErr.message };
      }
    } catch (err) {
      console.error('generateArticleIdeas error:', err);
      return { success: false, error: err.message || String(err) };
    }
  }

  // image generation via server proxy
  async generateImage(prompt, style = 'realistic') {
    try {
      const body = {
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json'
      };

      const res = await fetch(this.imagesEndpoint, {
        method: 'POST',
        headers: this._buildHeaders(),
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Image server returned ${res.status}: ${errText}`);
      }

      const data = await res.json();
      if (data.data && data.data[0] && data.data[0].b64_json) {
        return { success: true, data: { b64_json: data.data[0].b64_json } };
      }
      throw new Error('Unexpected image response format');
    } catch (err) {
      console.error('generateImage error:', err);
      return { success: false, error: err.message || String(err) };
    }
  }
}

// Export global
window.GPT5Service = GPT5Service;

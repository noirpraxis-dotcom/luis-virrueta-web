"""
🔥 LUXMANIA TREND MONITOR PRO
Monitorea las mejores fuentes para detectar tendencias ANTES que la competencia
"""

import requests
import json
from datetime import datetime, timedelta
import time
from collections import Counter
import re

class TrendMonitor:
    def __init__(self):
        self.trends = []
        self.keywords_branding = [
            'branding', 'brand', 'logo', 'identity', 'design', 
            'AI design', 'generative design', 'midjourney', 'stable diffusion',
            'brand strategy', 'rebranding', 'visual identity', 'ChatGPT',
            'Claude', 'Gemini', 'marketing AI', 'brand psychology'
        ]
        
    # ===== PRODUCT HUNT (Nuevos productos antes que nadie) =====
    def get_product_hunt_trends(self):
        """Productos nuevos de IA, diseño y branding"""
        print("🎯 Escaneando Product Hunt...")
        try:
            # Product Hunt posts del día
            url = "https://api.producthunt.com/v2/api/graphql"
            # Nota: Necesitarás API key de Product Hunt (gratis)
            # Por ahora uso el feed público
            
            feed_url = "https://www.producthunt.com/feed"
            headers = {'User-Agent': 'Mozilla/5.0'}
            response = requests.get(feed_url, headers=headers, timeout=10)
            
            # Parsear productos relevantes
            products = self._parse_product_hunt_rss(response.text)
            
            for product in products[:10]:
                self.trends.append({
                    'source': 'Product Hunt',
                    'title': product['title'],
                    'description': product.get('description', ''),
                    'url': product['link'],
                    'relevance': self._calculate_relevance(product['title'] + ' ' + product.get('description', '')),
                    'timestamp': datetime.now()
                })
            
            print(f"   ✅ {len(products)} productos encontrados")
        except Exception as e:
            print(f"   ⚠️ Error: {e}")
    
    # ===== HACKER NEWS (Tech trends de Silicon Valley) =====
    def get_hacker_news_trends(self):
        """Top stories de HN - lo que lee la tech elite"""
        print("🧠 Escaneando Hacker News...")
        try:
            # Top stories
            url = "https://hacker-news.firebaseio.com/v0/topstories.json"
            response = requests.get(url, timeout=10)
            story_ids = response.json()[:30]  # Top 30
            
            relevant_stories = []
            for story_id in story_ids[:15]:  # Revisar primeros 15
                story_url = f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json"
                story = requests.get(story_url, timeout=5).json()
                
                if story and 'title' in story:
                    title = story.get('title', '')
                    relevance = self._calculate_relevance(title)
                    
                    if relevance > 0:
                        self.trends.append({
                            'source': 'Hacker News',
                            'title': title,
                            'url': story.get('url', f"https://news.ycombinator.com/item?id={story_id}"),
                            'score': story.get('score', 0),
                            'relevance': relevance,
                            'timestamp': datetime.now()
                        })
                        relevant_stories.append(title)
            
            print(f"   ✅ {len(relevant_stories)} stories relevantes")
        except Exception as e:
            print(f"   ⚠️ Error: {e}")
    
    # ===== REDDIT (Pain points reales) =====
    def get_reddit_trends(self):
        """Posts populares de subreddits clave"""
        print("🔴 Escaneando Reddit...")
        subreddits = ['branding', 'marketing', 'artificial', 'design', 'entrepreneur']
        
        try:
            for subreddit in subreddits:
                url = f"https://www.reddit.com/r/{subreddit}/hot.json?limit=10"
                headers = {'User-Agent': 'TrendMonitor/1.0'}
                response = requests.get(url, headers=headers, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    posts = data['data']['children']
                    
                    for post in posts:
                        post_data = post['data']
                        title = post_data.get('title', '')
                        relevance = self._calculate_relevance(title)
                        
                        if relevance > 0:
                            self.trends.append({
                                'source': f'Reddit r/{subreddit}',
                                'title': title,
                                'url': f"https://reddit.com{post_data.get('permalink', '')}",
                                'upvotes': post_data.get('ups', 0),
                                'comments': post_data.get('num_comments', 0),
                                'relevance': relevance,
                                'timestamp': datetime.now()
                            })
                
                time.sleep(2)  # Rate limiting
            
            print(f"   ✅ Reddit escaneado")
        except Exception as e:
            print(f"   ⚠️ Error: {e}")
    
    # ===== TECH NEWS RSS (TechCrunch, The Verge, Fast Company) =====
    def get_tech_news_trends(self):
        """Noticias de los medios top"""
        print("📰 Escaneando Tech News...")
        
        feeds = {
            'TechCrunch': 'https://techcrunch.com/feed/',
            'The Verge': 'https://www.theverge.com/rss/index.xml',
            'Fast Company': 'https://www.fastcompany.com/latest/rss'
        }
        
        try:
            for source, feed_url in feeds.items():
                headers = {'User-Agent': 'Mozilla/5.0'}
                response = requests.get(feed_url, headers=headers, timeout=10)
                
                articles = self._parse_rss_feed(response.text)
                
                for article in articles[:10]:
                    relevance = self._calculate_relevance(article['title'] + ' ' + article.get('description', ''))
                    
                    if relevance > 0:
                        self.trends.append({
                            'source': source,
                            'title': article['title'],
                            'description': article.get('description', ''),
                            'url': article['link'],
                            'relevance': relevance,
                            'timestamp': datetime.now()
                        })
                
                time.sleep(1)
            
            print(f"   ✅ Tech news escaneado")
        except Exception as e:
            print(f"   ⚠️ Error: {e}")
    
    # ===== ANÁLISIS Y SCORING =====
    def _calculate_relevance(self, text):
        """Calcula relevancia basada en keywords"""
        text_lower = text.lower()
        score = 0
        
        # Keywords premium (peso alto)
        premium_keywords = ['AI', 'ChatGPT', 'GPT-5', 'GPT-4', 'Claude', 'Gemini', 
                           'midjourney', 'stable diffusion', 'brand', 'branding', 
                           'logo', 'rebranding', 'design AI']
        
        for keyword in premium_keywords:
            if keyword.lower() in text_lower:
                score += 3
        
        # Keywords regulares
        for keyword in self.keywords_branding:
            if keyword.lower() in text_lower:
                score += 1
        
        return score
    
    # ===== PARSERS =====
    def _parse_rss_feed(self, xml_text):
        """Parser simple de RSS"""
        articles = []
        items = re.findall(r'<item>(.*?)</item>', xml_text, re.DOTALL)
        
        for item in items:
            title_match = re.search(r'<title>(.*?)</title>', item)
            link_match = re.search(r'<link>(.*?)</link>', item)
            desc_match = re.search(r'<description>(.*?)</description>', item)
            
            if title_match and link_match:
                articles.append({
                    'title': self._clean_html(title_match.group(1)),
                    'link': link_match.group(1),
                    'description': self._clean_html(desc_match.group(1)) if desc_match else ''
                })
        
        return articles
    
    def _parse_product_hunt_rss(self, xml_text):
        """Parser de Product Hunt RSS"""
        return self._parse_rss_feed(xml_text)
    
    def _clean_html(self, text):
        """Limpia HTML tags"""
        text = re.sub(r'<[^>]+>', '', text)
        text = re.sub(r'&[a-z]+;', ' ', text)
        return text.strip()
    
    # ===== GENERACIÓN DE REPORTE =====
    def generate_report(self):
        """Genera reporte con tendencias priorizadas"""
        print("\n" + "="*80)
        print("📊 REPORTE DE TENDENCIAS - LUXMANIA")
        print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*80 + "\n")
        
        # Ordenar por relevancia
        sorted_trends = sorted(self.trends, key=lambda x: x['relevance'], reverse=True)
        
        # Top 20 tendencias
        print("🔥 TOP 20 TENDENCIAS MÁS RELEVANTES:\n")
        
        for i, trend in enumerate(sorted_trends[:20], 1):
            print(f"{i}. [{trend['source']}] {trend['title']}")
            print(f"   🎯 Relevancia: {'⭐' * min(trend['relevance'], 5)}")
            print(f"   🔗 {trend['url']}")
            
            if 'score' in trend:
                print(f"   📈 Score HN: {trend['score']}")
            if 'upvotes' in trend:
                print(f"   👍 Upvotes: {trend['upvotes']} | 💬 Comments: {trend['comments']}")
            
            print()
        
        # Keywords trending
        print("\n" + "="*80)
        print("🔑 KEYWORDS TRENDING:\n")
        
        all_text = ' '.join([t['title'] for t in self.trends])
        words = re.findall(r'\b[A-Za-z]{4,}\b', all_text.lower())
        word_counts = Counter(words)
        
        # Filtrar keywords relevantes
        relevant_words = [(word, count) for word, count in word_counts.most_common(30) 
                         if any(kw.lower() in word for kw in self.keywords_branding)]
        
        for word, count in relevant_words[:15]:
            print(f"   • {word.upper()}: {count} menciones")
        
        # Sugerencias de artículos
        print("\n" + "="*80)
        print("✍️ SUGERENCIAS DE ARTÍCULOS:\n")
        
        article_ideas = self._generate_article_ideas(sorted_trends[:10])
        for i, idea in enumerate(article_ideas, 1):
            print(f"{i}. {idea}")
        
        print("\n" + "="*80)
        print(f"✅ Total de tendencias detectadas: {len(self.trends)}")
        print("="*80 + "\n")
        
        # Guardar reporte en archivo
        self._save_report(sorted_trends, article_ideas)
    
    def _generate_article_ideas(self, top_trends):
        """Genera ideas de artículos basadas en tendencias"""
        ideas = []
        
        # Analizar patrones
        ai_mentions = sum(1 for t in top_trends if 'ai' in t['title'].lower() or 'gpt' in t['title'].lower())
        design_mentions = sum(1 for t in top_trends if 'design' in t['title'].lower())
        brand_mentions = sum(1 for t in top_trends if 'brand' in t['title'].lower())
        
        if ai_mentions >= 3:
            ideas.append("🤖 [IA + Branding] Nuevas herramientas de IA para diseño de marca que debes conocer")
            ideas.append("🎨 Cómo [Tool] está revolucionando el branding en 2025")
        
        if design_mentions >= 2:
            ideas.append("✨ Tendencias de diseño de marca que dominarán 2025")
        
        if brand_mentions >= 2:
            ideas.append("📊 Casos de rebranding exitosos: Qué podemos aprender")
        
        # Ideas específicas de top trends
        for trend in top_trends[:5]:
            title = trend['title']
            if 'ChatGPT' in title or 'GPT' in title:
                ideas.append(f"💡 {title} - Aplicaciones para branding estratégico")
            elif 'midjourney' in title.lower():
                ideas.append("🎨 Midjourney vs otras IAs: Cuál usar para tu marca")
        
        return ideas[:5]  # Top 5 ideas
    
    def _save_report(self, trends, article_ideas):
        """Guarda reporte en JSON"""
        report_data = {
            'timestamp': datetime.now().isoformat(),
            'total_trends': len(trends),
            'top_trends': trends[:20],
            'article_ideas': article_ideas
        }
        
        filename = f"trend-report-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False, default=str)
        
        print(f"💾 Reporte guardado en: {filename}")
    
    # ===== EJECUCIÓN PRINCIPAL =====
    def run(self):
        """Ejecuta el monitor completo"""
        print("\n🚀 INICIANDO TREND MONITOR PRO...\n")
        
        self.get_hacker_news_trends()
        time.sleep(2)
        
        self.get_reddit_trends()
        time.sleep(2)
        
        self.get_tech_news_trends()
        time.sleep(2)
        
        self.get_product_hunt_trends()
        
        print("\n✅ Escaneo completado. Generando reporte...\n")
        self.generate_report()


# ===== EJECUTAR =====
if __name__ == "__main__":
    monitor = TrendMonitor()
    monitor.run()

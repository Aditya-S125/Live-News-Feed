const newsDiv = document.getElementById('newsDiv');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorText = document.getElementById('errorText');
const mySearchInput = document.getElementById('mySearchInput');
const mySearchBtn = document.getElementById('mySearchBtn');
const myCategoryDropdown = document.getElementById('myCategoryDropdown');


async function getNewsData(categoryValue, searchKeyword) {
    
    
    loadingSpinner.classList.remove('hide-me');
    errorText.classList.add('hide-me');
    newsDiv.innerHTML = ""; 

    
    const url = "https://saurav.tech/NewsAPI/top-headlines/category/" + categoryValue + "/us.json";

    
    try {
        const response = await fetch(url);
        
        
        if (response.ok == false) {
            errorText.textContent = "Error: Server returned an invalid response code.";
            errorText.classList.remove('hide-me');
            loadingSpinner.classList.add('hide-me');
            return; 
        }

        
        const data = await response.json();
        const articlesArray = data.articles;

        
        
        let filteredArticles = [];
        
        if (searchKeyword != "") {
            for (let j = 0; j < articlesArray.length; j++) {
                const titleText = articlesArray[j].title.toLowerCase();
                let descText = "";
                
                if (articlesArray[j].description != null) {
                    descText = articlesArray[j].description.toLowerCase();
                }

                
                if (titleText.includes(searchKeyword.toLowerCase()) || descText.includes(searchKeyword.toLowerCase())) {
                    filteredArticles.push(articlesArray[j]);
                }
            }
        } else {
            
            filteredArticles = articlesArray;
        }

        
        if (filteredArticles.length == 0) {
            errorText.textContent = "No news articles found matching that keyword.";
            errorText.classList.remove('hide-me');
            loadingSpinner.classList.add('hide-me');
            return;
        }

        
        for (let i = 0; i < filteredArticles.length; i++) {
            const currentArticle = filteredArticles[i];

            
            if (currentArticle.title == "[Removed]" || currentArticle.title == null) {
                continue; 
            }

            
            const cardDiv = document.createElement('div');
            cardDiv.className = "news-card";

            
            let imgUrl = currentArticle.urlToImage;
            if (imgUrl == null || imgUrl == "") {
                imgUrl = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400";
            }

            
            let newsDesc = currentArticle.description;
            if (newsDesc == null || newsDesc == "") {
                newsDesc = "No summary available for this story. Click the link below to view the entire original article text.";
            }

            
            cardDiv.innerHTML = " <img src='" + imgUrl + "'> <div> <h3>" + currentArticle.title + "</h3> <p>" + newsDesc + "</p> </div> <a href='" + currentArticle.url + "' target='_blank'>Read Full Story &rarr;</a> ";

            
            newsDiv.appendChild(cardDiv);
        }

    } catch (err) {
        console.log(err);
        errorText.textContent = "Unable to connect to the server. Please check your internet connection.";
        errorText.classList.remove('hide-me');
    }



    loadingSpinner.classList.add('hide-me');
}

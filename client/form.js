const form = document.querySelector(".book-review-form");
const list= document.querySelector(".list"); 

const allReviews = () => {
    return fetch("http://localhost:8000/reviews")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      });
  }; 

  const refreshAllReviews = () => {
    allReviews()
      .then((data) => { 
        const reversedData = data.reverse();
        const html = reversedData
          .map(
            (review) =>
            `<li> 
            <h3>${review.name}</h3> 
            <p class="rate">Rate: ${review.rate}</p>  
            <p class="review" style="display: none;">${review.review}</p>
            <button class="show">Show review</button> 
            <button class="delete">Delete</button>     
            <button class="edit" title="Click to edit the review">Edit review</button>   
            </li>` 
          )
          .join("");
  
        list.innerHTML = html;
      }).catch((error) => {
        console.error(error); 
    }); 
  };


const insertSingleReview = (newReview) => {
    const htmlElement = `<li> 
            <h3>${newReview.name}</h3> 
            <p class="rate">Rate: ${newReview.rate}</p>  
            <p class="review" style="display: none;">${newReview.review}</p>
            <button class="show">Show review</button> 
            <button class="delete">Delete</button>     
            <button class="edit" title="Click to edit the review">Edit review</button>   
            </li>` 
    list.insertAdjacentHTML("afterbegin", htmlElement);
  };
  
form.addEventListener("submit", (e) => {
e.preventDefault(); 
const newReview = { 
    name: e.currentTarget.name.value,
    rate: e.currentTarget.rate.value,
    review: e.currentTarget.review.value,
};     
allReviews()
.then((data) => {   
    const names = data.map((review)=>review.name) 
    console.log(names);  
    // Make sure the name is unique.
    if (names.includes(newReview.name)){ 
        alert("Name already exists. Please use a different name.")
    } else { 
        fetch("http://localhost:8000/review", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newReview),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Success:", data);
              e.target.reset();
              insertSingleReview(newReview);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
    }
})
.catch((error) => {
    console.error(error); 
});  
}) 

const toggleReview = (review, button) => { 
    if (review.style.display === "none") {
        review.style.display = "block";
        button.textContent = "Hide review";
    } else {
        review.style.display = "none";
        button.textContent = "Show review";
    }
}

list.addEventListener("click", (e) => {
    if (e.target.classList.contains("show")) {
        const button = e.target;
        const listItem = button.closest('li');
        const review = listItem.querySelector(".review"); 
        toggleReview(review, button);
    }
});  

list.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        const button = e.target;
        const listItem = button.closest('li');   
        const name = listItem.querySelector('h3').textContent;
        if (listItem){ 
            listItem.remove();
        }   
        fetch(`http://localhost:8000/reviews/${name}`, {
            method: "DELETE",
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Success:", data);
            })
            .catch((error) => {
              console.error("Error:", error);
            });

    }
}); 

list.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit")) {
        const editButton = e.target;
        const listItem = editButton.closest('li');
        const review = listItem.querySelector(".review");  
        const showButton = listItem.querySelector(".show") 
        const name = listItem.querySelector('h3').textContent;
        const newReview = { 
            review: review.textContent
        };   
        if (review.getAttribute("contentEditable") === "true") { 
            review.setAttribute("contentEditable", "false");
            editButton.textContent = "Edit review";   
            fetch(`http://localhost:8000/reviews/${name}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(newReview),
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log("Success:", data);
                })
                .catch((error) => {
                  console.error("Error:", error);
                });

        } else {  
            if (review.style.display === "none"){
            toggleReview(review, showButton); 
            }
            review.setAttribute("contentEditable", "true");
            editButton.textContent = "Save review"; 
        }
    }
    }
);  

refreshAllReviews();

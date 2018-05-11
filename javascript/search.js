$(function() {
    
    var database = firebase.database();
    
    var includedArr = [];
    var excludedArr = [];
    var offset = 0;
    var searchParam = "";
    
    
    function displayRecipes(search) {

        // console.log(searchParam)
        console.log(offset)

        $("#addMore").remove();
        var queryURL = "https://api.yummly.com/v1/api/recipes?_app_id=32912019&_app_key=210449776997cc0adaf6fb150addc070" + search + "&maxResult=12&start=" + offset;
    
        $.ajax({
        url: queryURL,
        method: "GET"
        })
        .then(function(response) {
            var results = response.matches;

            var recipeRow1 = $("<div>");
            recipeRow1.addClass("row");
            var recipeRow2 = $("<div>");
            recipeRow2.addClass("row");
    
            for (var i = 0; i < 6; i++) {
                
                var recipeDiv = $("<div>");
                recipeDiv.attr("getId", results[i].id)
                recipeDiv.addClass("recipeDiv");
                recipeDiv.addClass("col s2");
                recipeDiv.html("<div class='card'><div class='card-image'><img src='" + results[i].imageUrlsBySize[90] + "'></div><div class='card-content'><p>" + results[i].recipeName+ "</p></div></div>");
                recipeRow1.prepend(recipeDiv)
                // $("#results-section").prepend(recipeDiv);
            }
            $("#results-section").prepend(recipeRow1);

            for (var i = 6; i < 12; i++) {
                
                var recipeDiv = $("<div>");
                recipeDiv.attr("getId", results[i].id)
                recipeDiv.addClass("recipeDiv");
                recipeDiv.addClass("col s2");
                recipeDiv.html("<div class='card'><div class='card-image'><img src='" + results[i].imageUrlsBySize[90] + "'></div><div class='card-content'><p>" + results[i].recipeName + "</p></div></div>");

                recipeRow2.prepend(recipeDiv)
                // $("#results-section").prepend(recipeDiv);
            }
            $("#results-section").prepend(recipeRow2);

            $("#addMoreSection").empty();
        
            var addMore = $("<button>");
            addMore.addClass("btn waves-effect waves-light purple darken-1 ").attr("id", "addMore").attr("type", "submit").attr("name", "action").attr("style","color: white");
            addMore.html("More Results<i class='material-icons right'>add_circle_outline</i>");
            $("#addMoreSection").prepend(addMore);
        });

    } 
    
    $(document.body).on("click", ".recipeDiv", function() {

        var recipeId = $(this).attr("getId");
        localStorage.setItem("recipe", recipeId);

        var user = localStorage.getItem("user");
        console.log(user)
       database.ref("users").child('why').push({
           recipe: recipeId
       });
    
        window.open('details.html', '_blank');
    
    });
    

    function renderIngredients() {
    
        $("#included-section").empty();
        $("#excluded-section").empty();

    
        for (var i = 0; i < includedArr.length; i++) {
            var a = $("<span>");
            a.text(includedArr[i]);
            $("#included-section").append(a);
            a.html(includedArr[i] + "<span class='x-included' data='" + includedArr[i] + "'>  <i class='material-icons'>cancel</i>    </span>");
            $("#included-section").append(a);
            console.log(includedArr)
        }
        for (var i = 0; i < excludedArr.length; i++) {
            var a = $("<span>");
            a.text(excludedArr[i]);
            $("#excluded-section").append(a);
            a.html(excludedArr[i] + "<span class='x-excluded' data='" + excludedArr[i] + "'>  <i class='material-icons'>cancel</i>    </span>" );
            $("#excluded-section").append(a);
            console.log(excludedArr)
        }
    }

    
    $("#add-ingredient").on("click", function(event) {
        event.preventDefault();
        var button = $("#included-ingredient").val().trim();
        $("#included-ingredient").val('');
        if (button != '') {
            includedArr.push(button);
            renderIngredients();
        }
    });

    $("#exclude-ingredient").on("click", function(event) {
        event.preventDefault();
        var button = $("#excluded-ingredient").val().trim();
        $("#excluded-ingredient").val('');
        if (button != '') {
            excludedArr.push(button);
            renderIngredients();
        }
    });
    
    $(document).on("click", ".search-recipes", function() {
        $("#results-section").empty();
        searchParam = "";
        offset = 0;
        var diet = $(".dietParam").val();
        var allergy = $(".allergyParam").val();

        for (var i = 0; i < includedArr.length; i++) {
            searchParam += "&allowedIngredient[]=" + includedArr[i];
        }
        for (var i = 0; i < excludedArr.length; i++) {
            searchParam += "&excludedIngredient[]=" + excludedArr[i];
        }
        if (diet) {
            searchParam += "&allowedDiet[]=" + diet;
        }
        for (var i = 0; i < allergy.length; i++) {
            searchParam += "&allowedAllergy[]=" + allergy[i];
        }
        displayRecipes(searchParam);
    });
    
    $(document).on("click", "#addMore", function() {
        offset += 12;
        console.log(offset)
        displayRecipes(searchParam);
    });

    $(document).on("click", ".x-included", function() {
        // var data = ($(this).closest("div").attr("data"))
        var data = $(this).attr("data");
        for (var i = 0; i < includedArr.length; i++) {
            if (data === includedArr[i]) {
                includedArr.splice(i, 1);
            }
        }
        $(this).parent().remove();
        console.log(includedArr)
    });

    $(document).on("click", ".x-excluded", function() {
        // var data = ($(this).closest("div").attr("data"))
        var data = $(this).attr("data");
        console.log(data)
        for (var i = 0; i < excludedArr.length; i++) {
            if (data === excludedArr[i]) {
                excludedArr.splice(i, 1);
            }
        }
        $(this).parent().remove();
        console.log(excludedArr)
    });
    
    //MATERIALIZE INITIATIONS

    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems, options);
      });
        
      $(document).ready(function(){
        $('select').formSelect();
      });  
      $(document).ready(function() {
        $('input#input_text, textarea#textarea2').characterCounter();
      });
    
    });

    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.fixed-action-btn');
        var instances = M.FloatingActionButton.init(elems, {
          direction: 'left'
        });
      });


     
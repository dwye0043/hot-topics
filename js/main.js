/*global $, console*/
$(document).ready(function () {
    
    "use strict";
    
    /*
     * Declare/Initialize Variables:
     *      contents    Object storing main content
     *      url         Relative path to HTML partial
     *      nm          Name of user (from HTML form)
     *      em          Email of user (from HTML form)
     *      sb          Subject user entered (from HTML form)
     *      ms          Message user entered (from HTML form)
     *      dt          Object collects name, email, subject, msg from form (all together)
     *      errors      Array of errors for form-validation
     *      collect     Stores error msgs parsed into HTML structure (as ul)
     *      i           Index pointer
    */
    
    var contents,
        url,
        nm,
        em,
        sb,
        ms,
        dt,
        errors,
        collect,
        i;
    
    contents = {};
    errors = [];
    dt = {};
    
    // ==============================================================================
    // Use load method to load the home.html into index
    $(".main-bg .box").load("./partials/home.html", function (rsp) {
        // Set key to url
        contents["./partials/home.html"] = rsp;
            
    });
    
    
    // ==============================================================================
    /*
     * HANDLING HTML FORM - SEND DATA TO SERVER USING $.ajax({})
    */

    /* 
     * Handle the success response of form handling ajax object through function 
     * handleResponse.  This function has a parameter - rsp which contains server's
     * response to the request of web browser. 
    */
    
    function handleResponse(rsp) {
        
        // Pass the response to HTML element with class "feedback" 
        
        $(".feedback").html(rsp);
        
        // Use val() jQuery method to clear the form fields
        
        $("#name").val("");
        $("#email").val("");
        $("#subject").val("");
        $("#message").val("");
    
    }  // End Function handleResponse

    
    // ==============================================================================
    /* 
     * Handle the error response of form handling ajax object. 
     * Define function handleErrors with 3 parameters: 
     * - jqXHR, textStatus, errorThrown
     * Print the error in JavaScript console 
    */
    
    function handleErrors (jqXHR, textStatus, errorThrown) {
        console.log("textStatus: " + textStatus + "\n" +
                    "errorThrown: " + errorThrown);
    }
    
    
    // ==============================================================================
    /* 
     * Define validateForm function. 
     * The form will be handled on submit event so you need event object parameter.
    */
    
    function validateForm (ev) {
            
        // Prevent default behaviour of form element 
        ev.preventDefault();
    
        /*
         * Access all form elements and pass their value to variables
         * Use $.trim() method to remove white space from form elements
        */
        
        nm = $("#name").val().trim();
        em = $("#email").val().trim();
        sb = $("#subject").val().trim();
        ms = $("#message").val().trim();
            
                
        // VALIDATE NAME FIELD:  
        /* 
         * If form name (nm) is empty string:
         * - Pass the corresponding error message to errors array
         * Else:
         * - Pass nm to object dt as a new property of that object
        */
        
        if (nm == "") { 
            errors.push("<p>Name?</p>");
        } else {
            dt.name = nm;
        }
       
        // EVALUATE EMAIL FIELD:
        /* 
         * If form email (em) is empty string:
         * - Pass the corresponding error message to errors array
         * Else:
         * - Pass nm to object dt as a new property of that object
        */
                   
        if (em == "") { 
            errors.push("<p>Email?</p>");
        } else {
            dt.email = em;
        }
        
       
        // EVALUATE SUBJECT FIELD: 
        /* 
         * If form subject (sb) is empty string:
         * - Pass the corresponding error message to errors array
         * Else:
         * - Pass nm to object dt as a new property of that object
        */
                   
        if (sb == "") { 
            errors.push("<p>Subject?</p>");
        } else {
            dt.subject = sb;
        }
               
        // EVALUATE MESSAGE FIELD:
        /* 
         * If form message (ms) is empty string:
         * - Pass the corresponding error message to errors array
         * Else:
         * - Pass nm to object dt as a new property of that object
        */
                   
        if (ms == "") { 
            errors.push("<p>Message?</p>");
        } else {
            dt.message = ms;
        }
       
        
        // ==========================================================================
        /* 
         * IF THERE ARE NO ERRORS, SEND DATA TO SERVER 
         * 
         * Use $.ajax({}) to send dt to server.
         * Chain done() and fail() methods to ajax object. 
         * Method done() calls handleResponse function if request is successful 
         * otherwise fail() method calls handleErrors.
        */
           
        if (errors.length === 0) {
            
            $.ajax({
                type: "post",
                url: "./server-side-script/web-service.php",
                data: dt,
                dataType: "text"
            }).done(handleResponse).fail(handleErrors);
            
        } else {
        
        // OTHERWISE PRINT ERRORS
            
            // Assign collect variable with initial message
            
            collect = "Please fix the following errors:<br><br>";
            
            /* 
             * Loop through array errors and parse the values of 
             * errors array to unordered list - for each loop iteration
             * append the result in collect variable. 
            */
            collect += "<ul>";
            
            for (i = 0; i < errors.length; i += 1) {
                collect += "<li>" + errors[i] + "</li>";
            }
            
            collect += "</ul>";
            
            // Pass collect to HTML element with class "feedback"
            
            $(".feedback").html(collect);
           
            // Empty errors array
            
            errors = [];
           
            // Assign collect with empty string
            
            collect = "";
       
        }
 
    }  // End function validateForm 

    
    // ==========================================================================
    /*
     * LOADING HTML PARTIALS
    */

    /* 
     * Define function storeContents. 
     * This function will have parameter - container. This is the HTML
     * element that receives content from HTML partials. 
    */
    
    function storeContents(container) {
                 
        /* 
         * If object contents doesn't contain the currently
         * loaded HTML partial (use url as key): 
        */
        
        if (contents[container]) {
            
            /* 
             * Use container as selector and html() 
             * method as action to display the content 
             * from object contents (contents[url]) 
            */    
                
            $(".main-bg .box").html(contents[container]);
            
        } else {
            /* 
             * Use container as selector and load() method
             * as action to load the content of HTML partial. 
             * The first parameter of load() method is already 
             * saved in variable url once contact-page nav-bar 
             * item is selected. Second parameter of load()
             * method is anonymous callback function which 
             * contains a parameter itself - pageRsp. pageRsp 
             * contains entire content from HTML partial 
            */
                        
            $(".main-bg .box").load(container, function(pageRsp) {
                
                // Pass pageRsp to contents object with the key url (contents[url])
                
                contents[container] = pageRsp;
                             
            });
                        
           }
        
    } // End function storeContents
    
    
    // ==========================================================================
    /* 
     * HANDLE NAV-BAR LINKS ON CLICK EVENT
    */
    /* 
     * Use nav-bar link element as selector and on() method for click-event. 
     * This event handler needs to use event object to prevent default behaviour 
     * of link element. 
    */
        
    $(".header-bg a").on("click", function(ev) {
        
        ev.preventDefault(); // to ensure you are not taken to another page
        
        /* 
         * Use $(this) as selector and attr() method to catch the relative path 
         * stored in href attribute of clicked link tag. 
         * Pass that value to variable url. 
         * (attr returns value of targeted object - in this case the link)
        */
        
        url = $(this).attr("href");
        
        /* 
         * Call function storeContents. Assign its parameter container with the CSS 
         * selector that points to HTML element which receives the page-content. 
        */
        
        storeContents(url);
        
        /* 
         * Add event listener - register validateForm function to the form element 
         * to listen for submit event.  
        */
        
        $(".main-bg .box").on("submit", "form", validateForm);
    
    });
    
});
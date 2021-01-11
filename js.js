//global variables to work upon

var dataListLoaded;
var filterApplied = false;
var loadingDiv =document.getElementById('loading');
var errorDiv = document.getElementById('404');
var EventsPresent = true;
var error = false;
var resultDiv = document.getElementById('box');
var collapsibleDiv = document.getElementById('collapsible');
collapsibleDiv.style.display = 'block';
console.log(collapsibleDiv);
var sI = {};

var deletedElements = {};

var originalEvents = [];
var filteredEvents = [];

//refreshing the page
const refreshPage = ()=>{
    location.reload();
};

const addEvent = ()=>{
    window.open('https://rebrand.ly/follege');
}

//precomputing the filter object to reduce time complexit

const add = (text) => {
    if(sI[text])
    {
        delete sI[text];
    }
    else{
        sI[text] = text;
    }
    return;
};


var Filter = {
    'Finance':{},
    'Coding Competitions':{},
    'Gaming':{},
    'Adventure':{},
    'Marketing':{},
    'Startup & Business':{},
    'Culture & Fest':{},
    'Technology':{},
    'Paid':{},
    'Unpaid':{}
};

//precomputing when the events are loaded

addToFilter = async (data) => {
    if(data.cost=='Free' || data.cost=='0')
    {
        Filter['Unpaid'][ data.id ] = data;
    }
    else{
        Filter['Paid'][ data.id ] = data;
    }

   try{
    (data.interests).forEach(int => {
        Filter[int.interest][data.id] = data;
    });
   }
   catch(err)
   {
       console.log(err);
   }
};


//filtering the events
filterDammit = async () => {
    if(error || !EventsPresent)
    {
        alert("Error");
        return;
    }
    console.log(sI);
    var level = 0;
    while(resultDiv.firstChild){
        resultDiv.removeChild(resultDiv.firstChild);
    }
    loadingDiv.style.display = 'block';
    if(Object.keys(sI).length == 0 || Object.keys(sI).length==8)
    {
        loadingDiv.style.display = 'none';
        dataListLoaded.forEach(data => {
            generateResults(data);
        })
        filteredEvents = [];
        filterApplied = false;
        return;
    }
    loadingDiv.style.display = 'none';
    var count = 0;
    dataListLoaded.forEach(data => {
        Object.keys(sI).forEach(interest => {
            displayed = false;
            if(!displayed && Filter[interest][data.id]!=null)
            {
                count++;
                filteredEvents.push(data.title + "," + data.id);
                generateResults(data);
                displayed = true;
            }
        });
    });
    filterApplied = true;

    if(count==0)
    {
        filteredEvents = [];
        filterApplied = false;
        alert("No result Found");
        dataListLoaded.forEach(data => {
        generateResults(data);
        });
    }

    console.log(filteredEvents);
    return;
}

//Loading events
window.onload = async ()=>{
    var resp;
    errorDiv.style.display = "none";
    loadingDiv.style.display = "block";
    try {
        let response =  await fetch('https://event-follege.herokuapp.com/events/',{
        method:'GET'
    });
    resp = response;
    } catch (error) {

        errorDiv.style.display = "block";
        loadingDiv.style.display = "none";
        error = true;
    return;    
    }
    let Result = await resp.json();
    loadingDiv.style.display = "none";
    if(Result.Items.length==0)
    {
        EventsPresent = false;
    }
    dataListLoaded = Result.Items;
    error = false;
    (Result.Items).forEach(element => {
        originalEvents.push(element.title + "," + element.id);
        addToFilter(element);
       generateResults(element);
    });

    console.log(Filter);

    console.log(originalEvents);
};


//deleting events

deleteAnEvent = async (id,imageUrl,title) => {

    var r = confirm("This event will be deleted !! ");
    if(r==false)
    {
        alert("The event will not be deleted");
        return;
    }

    console.log("Trying");
    var url = 'https://event-follege.herokuapp.com/page/delete/' + id;
    var url1 = 'https://event-follege.herokuapp.com/page/deletePhoto/';

    console.log(id);
    var result;
    fetch(url)
    .then(async response => {
        var result = await response.json();
        if(response.status>=400)
        {
            alert("Bad call");
            return ;
        }
    })   
    .then(async data => {
        result = await data;
        console.log(data);
    })
    .catch((error) => {console.log(error);alert(error); return;});
    deletedElements[id] = id;

    console.log(imageUrl);
    if(imageUrl === "https://follege.herokuapp.com/images/default_backdrop.jpg")
    {
        try{
            var f = document.getElementById(id);
            f.style.display = 'none';
            alert("Event deleted");
            return;
        }
        catch(err)
        {
            console.log("Error in deleting");
            return;
        }
    }
    var key = "";
    var i = 0;
    for(var i = imageUrl.length-1;imageUrl[i]!='/';)
    {
        i--;
    }
    var result2;

    key = imageUrl.substring(i+1);
    fetch(url1 + key)
    .then(async response => {
        var res = await response.json();
        if(response.status>=400)
        {
            alert("Photo was not deleted");
            return;
        }
    })   
    .then(data => {
        result2 = data;
        console.log(data);
    })
    .catch((error) => {console.log(error);alert(error); return;});

    console.log(result);
    console.log(result2);
        
    try{
        var f = document.getElementById(id);
        f.style.display = 'none';
        alert("Event deleted completed Including photo");
    }
    catch(err)
    {
        console.log("Error in removing the event from the screen");
    }

}


//filterBox pop out
var filterBox = document.getElementById('filterBox');

openFilter = () => {
    filterBox.style.display = "block";
}
closeFilter = () => {
    try{
        filterBox.style.display = 'none';
    }
    catch(err){
        console.log('Already closed');
    }
}


//updating event
updateAnEvent = async () => {
    alert("Work in progress");
    return;
}

const openModal = (id) => {
    var modal = document.getElementById(id);
    modal.style.display = 'block';
    return;
}

const closeModal = (id) => {
    var modal = document.getElementById(id);
    modal.style.display = 'none';
}


//textbox filter search
const happen = (textBox) => {
    var empty = true;
    if(error || !EventsPresent)
    {
        return;
    }
    var searchString = textBox.value;
    if(searchString.length == 0)
    {
        while(collapsibleDiv.firstChild)
        {
            collapsibleDiv.removeChild(collapsibleDiv.firstChild);
        }
        empty = true;
        return;
    }
    else{
        while(collapsibleDiv.firstChild)
        {
            collapsibleDiv.removeChild(collapsibleDiv.firstChild);
        }
        if(filterApplied)
        {
            filteredEvents.forEach(filter => {
                var title = filter.split(',');
                // if(title.length >= searchString.length)
                // {
                //     if(title.substring(0,searchString.length) == searchString)
                //     {
                //         generatePrefernce(filter);
                //     }
                // }
                // else
                title = title[0];
                title = title.replaceAll(' ','');
                title = title.replaceAll(':','');
                title = title.toLowerCase();
               

                if(title.length >= searchString.length && title.substring(0,searchString.length) == searchString)
                {
                    empty = false;
                    collapsibleDiv.style.display = "block";
                    console.log(searchString + " , "+  title);
                    generatePrefernce(filter);
                }
                delete title;
            });
        }
        else{
            originalEvents.forEach(filter => {
                var title = filter.split(',');
                // if(title.length >= searchString.length)
                // {
                //     if(title.substring(0,searchString.length) == searchString)
                //     {
                //         generatePrefernce(filter);
                //     }
                // }
                // else
                
                title = title[0];
                title = title.replaceAll(' ','');
                title = title.replaceAll(':','');
                title = title.toLowerCase();

                if(title.length >= searchString.length && title.substring(0,searchString.length) == searchString)
                {
                    empty = false;
                    collapsibleDiv.style.display = "block";
                    console.log(searchString + " , "+  title);
                    generatePrefernce(filter);
                }
                delete title;
            });

        }
    }
}


//display results

function generateResults(data)
{
   if(deletedElements[data.id])
   {
       return;
   }
    const wrapper = document.createElement("div");
    wrapper.setAttribute("class","col-12 col-xs-12 col-md-4 col-lg-3");
    wrapper.setAttribute("style","margin-bottom:2%;");
    wrapper.setAttribute("id",data.id);

    const container = document.createElement("div");
    container.setAttribute("class","container_fluid");
    
    if(data.cost == "Free")
    {
        //background-color:rgba(0, 128, 0, 0.171);
        container.setAttribute("style","border-radius:10px; border-width:4px; border-style: solid; border-color:rgb(43, 168, 226);");
    }
    else if(data.cost!='Free'){
        //background-color:rgba(128, 0, 0, 0.171);
        container.setAttribute("style","border-radius:10px; border-width:4px; border-style: solid; border-color:red; ");
    }


    const row = document.createElement("div");
    row.setAttribute("class","row");
    row.setAttribute("style","padding:0px;");


    
    const img_container = document.createElement("div");
    img_container.setAttribute("class","col-12 col-xs-12 col-md-12 col-lg-12");
    img_container.setAttribute("style","text-align:center; margin-top:5px;");
    const image = document.createElement("img");
    image.setAttribute("src",data.imageUrl);
    image.setAttribute("style","width:50%;");
    img_container.appendChild(image);


    const body_class = document.createElement("div");
    body_class.setAttribute("class","col-12 col-xs-12 col-md-12 col-lg-12");
    body_class.setAttribute("style","text-align:center; padding-top:20px; padding-bottom:20px; padding-left:10px;padding-right:10px;")
    const h51 = document.createElement("h5");
    h51.setAttribute("style"," text-align:center; font-family: 'Kanit', sans-serif; margin-left:5px; margin-right:5px;white-space: normal;")
    h51.textContent = data.title;
    const h52 = document.createElement("h5");
    h52.setAttribute("style","font-size:smaller");
    h52.textContent = data.by;
    const p = document.createElement("p");
    p.setAttribute("onclick","openModal("+data.id+"m"+")");
    p.textContent = "More Info";
    let toPass="'" +  data.title + "," + data.by+","+data.about+","+data.imageUrl+","+data.cost+","+data.interests+","+data.startDateTime + ","+data.endDateTime +"'";
    p.setAttribute("onclick","updateAnEvent()");
    body_class.appendChild(h51);
    body_class.appendChild(h52);
    body_class.appendChild(p);
    
    const btn_cont = document.createElement("div");
    btn_cont.setAttribute("class","col-12 col-md-12 col-xs-12 col-lg-12");
    btn_cont.setAttribute("style","text-align: center; padding-bottom:5px;");
    
    const del = document.createElement("button");
    del.setAttribute("style","background-color:pink; margin-bottom:3%;");
    del.setAttribute("onclick","deleteAnEvent('"+data.id+"','"+data.imageUrl+"')");
    del.innerText = "DELETE ❌";

    const update = document.createElement("button");
    update.setAttribute("style","background-color:yellow; margin-left:3%; margin-bottom:3%;");
    update.setAttribute('onclick','updateAnEvent()');
    update.innerText = "UPDATE ➕";

    btn_cont.appendChild(del);
    btn_cont.appendChild(update);

    // row.appendChild(img_container);
    row.appendChild(body_class);
    row.appendChild(btn_cont);

    container.appendChild(row);
    wrapper.appendChild(container);
    //end section button
    var rs = document.getElementById("box");
    rs.appendChild(wrapper);
    delete toPass;
}

//display preferences
const generatePrefernce = (text) => {
    const p =document.createElement('p');
    let t = text.split(',');
    let O = t[0];
    O = O.replaceAll(' ','');
    O = O.replaceAll(':','');
    O = O.toLowerCase();
    let id = t[1]; 
    const a = document.createElement('a');
    a.setAttribute('href','#'+id);
    a.textContent = t[0];
    p.setAttribute("id",O);
    p.appendChild(a);
    console.log(p);
    collapsibleDiv.appendChild(p);
    console.log(collapsibleDiv);
    delete t,O,id,a;
}

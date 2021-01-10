
 var loading = document.getElementById('loading10');
 var fetching = document.getElementById('fetching');


const fetchUsers = async () => {
    let f = document.getElementById('formTitle');
    let g = document.getElementById('formText');
    if(f.value=='' || f.value==null)
    {
        alert('Empty title not allowed');
        return;
    }
    if(g.value=='' || g.value==null)
    {
        alert('Empty Body not allowed');
        return;
    }
    var r = confirm("Send this Notification");
    if(r==false)
    {
        alert("Denied");
        return;
    }
    fetching.style.display = 'block';
    
    var response = await fetch('https://follege.herokuapp.com/users/',{
        "method":'GET'
    });

    var result = await response.json();
    result = result.Items;
    fetching.style.display = 'none';
    loading.style.display = 'block';
    result.forEach(user => {
        console.log(user);
        if(user.expoPushToken)
        {
            try{
                sendNotification(f.value,g.value,user.expoPushToken)
            }
            catch(err)
            {
                console.log(err);
                loading.style.display = 'none';
                return;
                
            }
        }
    });

    alert('Success');
    loading.style.display = 'none';
    return;
}


const sendNotification = async (a,b,c) => {
    var response = await fetch('https://exp.host/--/api/v2/push/send' , {
        'method':'POST',
        'headers' : {
            'Content-Type':'application/json'
        },
        'mode':'no-cors',
        'body': JSON.stringify({
            to:c,
            sound:'default',
            title:a,
            body:b
        })
    })
    var result = await response.json;
    if(response.status===200)
    {
        return true;
    }
    else{
        return false;
    }
}
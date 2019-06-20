function Validation() {
    var firstname = document.getElementById("firstName").value;
    var lastname = document.getElementById("lastName").value;
    var username = document.getElementById("username").value;
    var sex = this.sex;
    var email = document.getElementById("email").value;
    var age = document.getElementById("age").value;
    var password = document.getElementById("password").value;
    var cfpassword = document.getElementById("confirmPassword").value;

    if(firstname == ""){
        alert("Firstname must be filled!");
        return false;
    }
    if(lastname == ""){
        alert("Lirstname must be filled!");
        return false;
    }
    if(username == ""){
        alert("Username must be filled!");
        return false;
    }
    if(sex != "Male" && sex != "Female"){
        alert("Sex must be filled!");
        return false;
    }
    if(age == ""){
        alert("Age must be filled!");
        return false;
    }
    if(password == ""){
        alert("Password must be filled!");
        return false;
    }
    if(password != cfpassword){
        alert("Password must be confirmed!");
        return false;
    }
    return true;
}

var sex = "";

function GetSex(value) {
    this.sex = value;
}


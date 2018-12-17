angular.module('starter.constants', [])
    .constant('CONSTANTS', (function() {
        // **** Development Server ***** //

        // var baseUrl = "https://dforms-gis-dev1.tatapower.com:2011";
        var baseUrl = "http://10.231.1.183:3001";
      
        var serverURL       =   baseUrl+"/api/v1";
        var unsecureUrl     =   baseUrl+"/api/v";
        return {
        taskid : "93e0d7010000000000000000",
        formid : "93cecf4f0000000000000000",
        Golobal_imagePath:unsecureUrl+"/",

        login:baseUrl+"/login",
        pwdChange:serverURL+"/users/pwdchange",
        forgotPassword:serverURL+"/forgotpwd",
        // mdaccept:serverURL+"/tasks/acceptcomplaints",
        mdreject:serverURL+"/tasks/rejectdcomplaints",
        mdaccept:serverURL+"/tasks/acceptcomplaints",
        mdupdate:serverURL+"/tasks/addTaskRecord",
        mcctoken:serverURL+"/tasks/acceptComplaintToken",
        forgotPassword:baseUrl+"/forgotpwd",
        revenue:serverURL+"/tasks/_getrevenuedetails/",
        previouscomplaints:serverURL+"/tasks/_getcomplaintdetails/",
        getFormsRecords:serverURL+"/formsz/formszDetails",
        gmlist:serverURL+"/users/getuserlistmaping/5b894dd170dc390c181a66b6",
        ReassignRecord:serverURL+"/formszDetails/ReAssign",
       // pdfEmail:serverURL+"/formszDetails/mobilegeneratePDF"
        pdfEmail:serverURL+"/formszDetails/generateMobileEmail"
        }
    })());

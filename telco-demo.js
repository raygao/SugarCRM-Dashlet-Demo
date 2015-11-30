({
    plugins: ['Dashlet'],

    //registering events, see javascript function, and events in the handlebar file.
    events: {
        'click [data-action=showcaseform]' : 'show_case_form',
        'click [data-action=createcase]' : 'create_case',
        'click [data-action=goback]' : 'go_back',
        'click [data-action=gotoservicerequest]' : 'go_to_service_request',
    },
    initDashlet: function () {

    },

    // variables used in the handlebar file.
    xnum_of_cases: undefined,
    xcases: undefined,
    xaccount_id: undefined,
    new_case_id: undefined,

    loadData: function(params) {
        this.xcases = this.model._relatedCollections.cases;
        this.xnum_of_cases = this.xcases.length;
        this.xaccount_id = this.model.id;

        // new_case_id = null;

        /*
        see also
        this.model._relatedCollections.cases.models[#].link.name  => 'cases'
        this.model._relatedCollections.cases.models[#].link.isNew => true/false
         this.model._relatedCollections.cases.models[#].attributes['name'] / 'id' / 'my_favorite' / 'date_entered' / 'date_modified'
        this.model._relatedCollections.cases.models[#].attributes
        */

    },

    show_case_form: function(data) {
        // hide the task_selection_div
        document.getElementById('task_selectoin_div').style.display = "none";
        document.getElementById('task_selectoin_div').style.visibility = "none";

        // show the new_case_form_div
        document.getElementById('new_case_form_div').style.display = "inline";
        document.getElementById('new_case_form_div').style.visibility = "visibile";
    },

    go_back: function(data) {
        // hide the task_selection_div
        document.getElementById('task_selectoin_div').style.display = "inline";
        document.getElementById('task_selectoin_div').style.visibility = "visible";

        // show the new_case_form_div
        document.getElementById('new_case_form_div').style.display = "none";
        document.getElementById('new_case_form_div').style.visibility = "none";
    },

    go_to_service_request: function(data) {
        // TODO Roxana
        alert('Goto service request, change the #Leads to your Service Request URL.');
        service_request_click_url = window.location.protocol+'//'+window.location.hostname+window.location.pathname + '#Leads';   //Change Lead to whatever, you want.
        window.location.href = service_request_click_url;
    },

    create_case: function () {
        // retrieving values from the Case creation form.
        new_case_name = document.getElementById('new_case_name').value;
        new_case_description = document.getElementById('new_case_description').value;
        the_account_id = document.getElementById('the_account_id').value;

        // functional progamming. scope of the this & resetting_view()
        var self = this;

        // Create case, associated with this account.
        app.api.call('create', app.api.buildURL('Cases/'),
            {"name" : new_case_name,
            "description" : new_case_description,
            "account_id" : the_account_id},
            {
                success: function (data) {
                    console.log(JSON.stringify(data));
                    // new_case_id = data.id;
                    // resetting the view of Handlebar file.
                    self.resetting_view(data);

                    app.alert.show('created_case_error', {
                        level: 'success',
                        title: 'Created a new Case.',
                        messages: 'Created a new case! ',
                        autoClose: false
                    });
                },

                error: function(result) {
                    console.log(JSON.stringify(data));
                    app.alert.show('created_case_error', {
                        level: 'error',
                        title: 'api error',
                        messages: 'Unable to create new case! ',
                        autoClose: false
                    });
                }
            });
    },

    resetting_view: function(data) {
        console.log('Resetting Dashlet view.');

        // Hiding the Case Creation Form Div.
        document.getElementById('new_case_form_div').style.display = "none";
        document.getElementById('new_case_form_div').style.visibility = "none";

        // Setting contents
        document.getElementById('created_case_name').innerText = data.name;
        document.getElementById('created_case_description').innerText = data.description;
        //document.getElementById('created_case_link').href = app.api.buildURL('Cases/' + data.id); // Only aRest point, not useful for Browser click through.

        // Building Browser click through URL.
        case_click_url = window.location.protocol+'//'+window.location.hostname+window.location.pathname + '#Cases/' + data.id;
        document.getElementById('created_case_link').href = case_click_url;

        // Showing the result Case Div
        document.getElementById('result_case_div').style.display = "inline";
        document.getElementById('result_case_div').style.visibility = "visible";
    }
})

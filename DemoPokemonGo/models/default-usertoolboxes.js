module.exports = {
    GetDefaultUserToolboxes: function (accountid) {
        var UserToolboxes = [
            { account_id: parseInt(accountid), toolbox_id: 1.0, quantity: 2 },
            { account_id: parseInt(accountid), toolbox_id: 2.0, quantity: 2 },
            { account_id: parseInt(accountid), toolbox_id: 3.0, quantity: 2 },
            { account_id: parseInt(accountid), toolbox_id: 4.0, quantity: 2 },
            { account_id: parseInt(accountid), toolbox_id: 5.0, quantity: 2 },
            { account_id: parseInt(accountid), toolbox_id: 6.0, quantity: 2 },
            { account_id: parseInt(accountid), toolbox_id: 7.0, quantity: 2 },
            { account_id: parseInt(accountid), toolbox_id: 8.0, quantity: 2 },
            { account_id: parseInt(accountid), toolbox_id: 9.0, quantity: 2 },
            { account_id: parseInt(accountid), toolbox_id: 10.0, quantity: 5 },
            { account_id: parseInt(accountid), toolbox_id: 11.0, quantity: 5 },
            { account_id: parseInt(accountid), toolbox_id: 12.0, quantity: 5 },
            { account_id: parseInt(accountid), toolbox_id: 13.0, quantity: 5 }
        ];
        return UserToolboxes;
    }
}
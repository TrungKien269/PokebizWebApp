module.exports = {
    GetDefaultUserBalls: function (accountid) {
        var UserBalls = [
            { account_id: parseInt(accountid), ball_id: 1.0, quantity: 200 },
            { account_id: parseInt(accountid), ball_id: 2.0, quantity: 50 },
            { account_id: parseInt(accountid), ball_id: 3.0, quantity: 0 },
            { account_id: parseInt(accountid), ball_id: 4.0, quantity: 0 }
        ];
        return UserBalls;
    }
}
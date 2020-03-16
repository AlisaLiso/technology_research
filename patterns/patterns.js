var Status;
(function (Status) {
    Status["PLAY"] = "PLAY";
    Status["PAUSE"] = "PAUSE";
})(Status || (Status = {}));
var Player = /** @class */ (function () {
    function Player() {
        // if (typeof Player._instance === "object") {
        throw Error('Error');
        // }
    }
    return Player;
}());
// const player = Player.instance;
// console.log(player);
console.log(Player.status);
Player.status = Status.PAUSE;
console.log(Player.status);

enum Status {
  PLAY = "PLAY",
  PAUSE = "PAUSE"
}

class Player {
  currentAudio: string;
  status: Status;

  constructor() {
    if (typeof Player._instance === "object") {
      throw Error('Error');
    }
  }

  private static _instance: Player = new Player();
  static get instance() {
    return Player._instance;
  }
}
const player = Player.instance;
console.log(player);
console.log(player.status);
player.status = Status.PAUSE

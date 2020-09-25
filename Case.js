class Case { 
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.v1 = {avg: 0, count: 0};
        this.v2 = {avg: 0, count: 0};
        this.empty = true;
        switch(type) {
            case "FOOD":
                this.v1 = {avg: 10, count: 0}
                this.v2 = {avg: -10, count: 0}
                break;
            case "BLOCK":
                this.v1 = {avg: -1, count: 0}
                this.v2 = {avg: -1, count: 0}
                break;
            case "HILL":
                this.v1 = {avg: -10, count: 0}
                this.v2 = {avg: 10, count: 0}
                break;
            default:
                this.v1 = {avg: 0, count: 0}
        }
    }
}
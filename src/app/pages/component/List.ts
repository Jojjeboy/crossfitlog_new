export class List {

    showGifNr: number = 0;
    colors: string[] = ["blue", "green", "yellow", "cyan", "pink", "purple"];


    toggleGif(index: number) {
        this.showGifNr = index;
        let seconds = 7;
        const interval = setInterval(() => {
            console.log(seconds); // Visar nedräkningen i konsolen
            seconds--;
            if (seconds < 0) {
                this.showGifNr = 0;
                clearInterval(interval);
            }
        }, 1000);
    }
}
<template>
    <div class="journey-sections" :id="shareIndex">
        <h2>Share Templates</h2>
        <div class="container text-center">
            <div class="canvas-container">
                <span class="material-symbols-rounded swipe">swipe_left</span>
                <button @click.prevent="previousCanvas" class="arrow left-arrow">
                    <span class="material-symbols-rounded">keyboard_double_arrow_left</span>
                </button>
                <div class="portrait-container" data-year="Share Journey" @touchstart="onTouchStart"
                    @touchmove="onTouchMove" @touchend="onTouchEnd">
                    <div v-for="(canvas, index) in canvases" :key="index"
                        :class="['portrait', { selected: selectedCanvas === index }]" :style="{
                            transform: `
                            translateX(calc(-${(selectedCanvas) * 103.5}% + 
                            ${9.4 * (canvases.length - 1)}rem)) 
                            scale(${selectedCanvas === index ? 1 : 0.8})
                        `}" @click=" selectCanvas(index)">
                        <canvas :ref="'portraitCanvas' + (index + 1)" width="1080" height="1920"></canvas>
                    </div>
                </div>
                <button @click.prevent="nextCanvas" class="arrow right-arrow">
                    <span class="material-symbols-rounded">keyboard_double_arrow_right</span>
                </button>
            </div>

            <div class="button-container">
                <button class="share-button" @click.prevent="shareCanvas">
                    <span class="material-symbols-rounded share">share</span>
                    <p>Share</p>
                </button>
                <button class="share-button" @click.prevent="downloadCanvas">
                    <span class="material-symbols-rounded">download</span>
                    <p>Download</p>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import birdoSrc from '@/assets/birdo.png';
import fadeSrc from '@/assets/fade.png';
import bgSrc from '@/assets/share_bg_1.png';
import bg2Src from '@/assets/share_bg_2.png';
import logoSrc from '@/assets/spütify_logo.png';
import userSrc from '@/assets/user.png';

export default {
    name: 'PrintComponent',
    props: {
        userName: {
            type: String,
            required: true
        },
        years: {
            type: Array,
            required: true
        },
        badges: {
            type: Array,
            required: true
        },
        shareIndex: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            selectedCanvas: 0,
            canvases: [1, 2, 3, 4, 5],
            touchStartX: 0,
            touchEndX: 0,
            shown: false
        };
    },
    mounted() {
        setTimeout(() => {
            this.drawCanvases();
        }, 1000);
    },
    methods: {
        drawCanvases() {
            this.drawOnCanvas1(this.$refs.portraitCanvas1[0]);
            this.drawOnCanvas2(this.$refs.portraitCanvas2[0]);
            this.drawOnCanvas3(this.$refs.portraitCanvas3[0]);
            this.drawOnCanvas4(this.$refs.portraitCanvas4[0]);
            this.drawOnCanvas5(this.$refs.portraitCanvas5[0]);
        },
        clearCanvas(ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        },

        setCanvasStyle(ctx) {
            ctx.textBaseline = "top";
        },

        loadImage(src, onSuccess, onError) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = src;
            img.onload = () => onSuccess(img);
            img.onerror = onError;
            return img;
        },

        drawGradientText(ctx, text, x, y, width, gradientStops, font) {
            const gradient = ctx.createLinearGradient(x, 0, x + width, 0);
            gradientStops.forEach(([stop, color]) => gradient.addColorStop(stop, color));
            ctx.fillStyle = gradient;
            ctx.font = font;
            const lines = text.split('\n');
            lines.forEach((line, index) => {
                ctx.fillText(line, x, y + index * 45);
            });
        },

        drawClippedImage(ctx, img, x, y, size) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            const aspectRatio = img.width / img.height;
            let drawWidth, drawHeight;

            if (aspectRatio > 1) {
                drawWidth = size;
                drawHeight = size / aspectRatio;
            } else {
                drawWidth = size * aspectRatio;
                drawHeight = size;
            }

            const offsetX = (size - drawWidth) / 2;
            const offsetY = (size - drawHeight) / 2;

            ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
            ctx.restore();
        },

        drawTextWithHyphenation(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
            const words = text.split(' ');
            let line = '';
            let yOffset = 0;
            let lines = 0;

            for (let word of words) {
                let testLine = line + word + ' ';
                let testWidth = ctx.measureText(testLine).width;

                if (testWidth > maxWidth && line !== '') {
                    ctx.fillText(line, x, y + yOffset);
                    lines++;
                    if (lines >= maxLines) return;
                    line = '';
                    yOffset += lineHeight;
                }

                while (ctx.measureText(word).width > maxWidth) {
                    let i = 1;
                    while (ctx.measureText(word.slice(0, i) + '-').width <= maxWidth && i < word.length) {
                        i++;
                    }
                    i--;
                    ctx.fillText(word.slice(0, i) + '-', x, y + yOffset);
                    lines++;
                    if (lines >= maxLines) return;
                    word = word.slice(i);
                    yOffset += lineHeight;
                }

                line += word + ' ';
            }
            ctx.fillText(line, x, y + yOffset);
        },

        drawOnCanvas1(canvas) {
            const ctx = canvas.getContext("2d");
            this.clearCanvas(ctx);
            this.setCanvasStyle(ctx);

            this.loadImage(
                bgSrc,
                (image) => {
                    ctx.drawImage(image, 0, 0, 540, 960);
                    this.drawMusicJourney(ctx);
                },
                () => {
                    console.error("Error loading background image for canvas1.");
                    this.drawMusicJourney(ctx);
                }
            );
        },

        drawMusicJourney(ctx) {
            this.drawGradientText(ctx, `${this.userName}'s \nMusic Journey`, 50, 80, 250, [
                [0, "#1DB954"],
                [1, "#4DD4AC"]
            ], "36px FranieBlack, sans-serif");

            const filteredYears = this.years.filter((year, index) => {
                if (index === 0) return false;
                if (index === 2 && this.years.length > 6) return false;
                return true;
            }).slice(0, 6);

            filteredYears.forEach((year, index) => {
                const yearText = `${year.title}`;
                const topTrackText = `music_note ${year.topTracks[0]?.name || "No data"}`;
                const topArtistText = `artist ${year.topArtists[0]?.name || "No data"}`;

                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                ctx.font = "28px FranieSemiBold, sans-serif";
                ctx.fillText(yearText, 50, 200 + index * 150);

                this.drawTopItem(ctx, topTrackText, 80, 240 + index * 150, 200, 30, 3, 0);
                this.drawTopItem(ctx, topArtistText, 340, 240 + index * 150, 150, 30, 3, 2);
            });

            this.drawFadeAndLogo(ctx);
        },

        drawTopItem(ctx, text, x, y, maxWidth, lineHeight, maxLines, iconOffset) {
            const [icon, ...textParts] = text.split(' ');
            ctx.font = "32px Material Symbols Rounded, sans-serif";
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.fillText(icon, x - 35 - iconOffset, y + 7);

            ctx.font = "28px Familjen Grotesk, sans-serif";
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            this.drawTextWithHyphenation(ctx, textParts.join(' '), x, y, maxWidth, lineHeight, maxLines);
        },

        drawOnCanvas2(canvas) {
            const ctx = canvas.getContext("2d");
            this.clearCanvas(ctx);
            this.setCanvasStyle(ctx);

            this.loadImage(
                bg2Src,
                (image) => {
                    ctx.drawImage(image, 0, 0, 540, 960);
                    this.drawCurrentFavorites(ctx);
                },
                () => {
                    console.error("Error loading background image for canvas2.");
                    this.drawCurrentFavorites(ctx);
                }
            );
        },

        drawCurrentFavorites(ctx) {
            this.drawGradientText(ctx, `${this.userName}'s \nCurrent Favorites`, 50, 80, ctx.canvas.width / 2, [
                [0, "#1DB954"],
                [1, "#4DD4AC"]
            ], "36px FranieBlack, sans-serif");

            const { topTracks = [], topArtists = [], topGenres = [] } = this.years[1] || {};

            this.drawTopItems(ctx, "Top Songs", topTracks, 200);
            this.drawTopItems(ctx, "Top Artists", topArtists, 450);
            this.drawTopItems(ctx, "Top Genres", topGenres, 700);

            this.drawFadeAndLogo(ctx);
        },

        drawTopItems(ctx, title, items, startY) {
            ctx.font = "28px FranieSemiBold, sans-serif";
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.fillText(title, 50, startY);

            items.forEach((item, index) => {
                ctx.font = "bold 28px Familjen Grotesk, sans-serif";
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                ctx.fillText(`${index + 1}`, 50, startY + 40 + index * 35);
                ctx.font = "28px Familjen Grotesk, sans-serif";
                ctx.fillStyle = "rgba(255, 255, 255, 1)";
                ctx.fillText(item.name, 80, startY + 40 + index * 35);
            });
        },

        drawOnCanvas3(canvas) {
            const ctx = canvas.getContext("2d");
            this.clearCanvas(ctx);
            this.setCanvasStyle(ctx);

            this.loadImage(
                bgSrc,
                (image) => {
                    ctx.drawImage(image, 0, 0, 540, 960);
                    this.drawTopArtists(ctx);
                },
                () => {
                    console.error("Error loading background image for canvas3.");
                    this.drawTopArtists(ctx);
                }
            );
        },

        drawTopArtists(ctx) {
            this.drawGradientText(ctx, `${this.userName}'s \nTop Artists\nover the Years`, 50, 80, 250, [
                [0, "#1DB954"],
                [1, "#4DD4AC"]
            ], "bold 36px FranieBlack, sans-serif");

            this.years.forEach((year, index) => {
                if (index !== 0 && index < 7) {
                    const yearText = `${year.title}`;
                    const topArtistText = `${year.topArtists[0]?.name || "No data"}`;

                    this.loadImage(
                        year.topArtists[0]?.images[0]?.url || userSrc,
                        (img) => this.drawClippedImage(ctx, img, 50, 111 + index * 110, 80),
                        () => console.error("Error loading artist image.")
                    );

                    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                    ctx.font = "28px FranieSemiBold, sans-serif";
                    ctx.fillText(yearText, 150, 145 + index * 110);

                    ctx.font = "28px Familjen Grotesk, sans-serif";
                    ctx.fillStyle = "rgba(255, 255, 255, 1)";
                    ctx.fillText(topArtistText, 150, 180 + index * 110);
                }
            });

            this.drawFadeAndLogo(ctx);
        },

        drawOnCanvas4(canvas) {
            const ctx = canvas.getContext("2d");
            this.clearCanvas(ctx);
            this.setCanvasStyle(ctx);

            this.loadImage(
                bg2Src,
                (image) => {
                    ctx.drawImage(image, 0, 0, 540, 960);
                    this.drawTopSongs(ctx);
                },
                () => {
                    console.error("Error loading background image for canvas4.");
                    this.drawTopSongs(ctx);
                }
            );
        },

        drawTopSongs(ctx) {
            this.drawGradientText(ctx, `${this.userName}'s \nTop Songs\nover the Years`, 50, 80, 250, [
                [0, "#1DB954"],
                [1, "#4DD4AC"]
            ], "bold 36px FranieBlack, sans-serif");

            this.years.forEach((year, index) => {
                if (index !== 0 && index < 7) {
                    const yearText = `${year.title}`;
                    const topTrackText = `${year.topTracks[0]?.name || "No data"}`;

                    this.loadImage(
                        year.topTracks[0]?.album.images[0].url || userSrc,
                        (img) => ctx.drawImage(img, 50, 111 + index * 110, 80, 80),
                        () => console.error("Error loading track image.")
                    );

                    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                    ctx.font = "28px FranieSemiBold, sans-serif";
                    ctx.fillText(yearText, 150, 145 + index * 110);

                    ctx.font = "28px Familjen Grotesk, sans-serif";
                    ctx.fillStyle = "rgba(255, 255, 255, 1)";
                    ctx.fillText(topTrackText, 150, 180 + index * 110);
                }
            });

            this.drawFadeAndLogo(ctx);
        },

        drawOnCanvas5(canvas) {
            const ctx = canvas.getContext("2d");
            this.clearCanvas(ctx);
            this.setCanvasStyle(ctx);

            this.loadImage(
                bgSrc,
                (image) => {
                    ctx.drawImage(image, 0, 0, 540, 960);
                    this.drawBadges(ctx);
                },
                () => {
                    console.error("Error loading background image for canvas5.");
                    this.drawBadges(ctx);
                }
            );
        },

        drawBadges(ctx) {
            this.drawGradientText(ctx, `${this.userName}'s \nBadges`, 50, 80, 250, [
                [0, "#1DB954"],
                [1, "#4DD4AC"]
            ], "36px FranieBlack, sans-serif");

            this.badges.forEach((badge, index) => {
                ctx.font = "40px Material Symbols Rounded, sans-serif";
                ctx.fillStyle = "rgba(255, 255, 255, 1)";
                ctx.fillText(badge.icon, 50, 210 + index * 135);

                ctx.font = "32px Familjen Grotesk, sans-serif";
                ctx.fillText(badge.title, 100, 200 + index * 135);

                ctx.font = "24px Familjen Grotesk, sans-serif";
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                this.drawTextWithHyphenation(ctx, badge.text, 50, 235 + index * 135, 450, 25, 3);
            });

            if (this.badges.length === 1 && this.badges[0].title === "No Badges?") {
                console.log("Drawing birdo image");
                this.loadImage(
                    birdoSrc,
                    (img) => ctx.drawImage(img, 160, 490, 259.5, 369.5),
                    () => console.error("Error loading birdo image.")
                );
            }

            this.drawFadeAndLogo(ctx);
        },

        drawFadeAndLogo(ctx) {
            this.loadImage(
                fadeSrc,
                (img) => {
                    ctx.drawImage(img, 490, 0, 50, 960);
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.drawImage(img, -50, 0, 50, 960);
                    ctx.restore();

                    this.loadImage(
                        logoSrc,
                        (logo) => ctx.drawImage(logo, 340, 910, 176.32, 35.52),
                        () => console.error("Error loading logo image.")
                    );
                },
                () => console.error("Error loading fade image.")
            );
        },

        clearCanvas(ctx) {
            ctx.clearRect(0, 0, 1080, 1920);
        },

        setCanvasStyle(ctx) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            const scaleFactor = 2;
            ctx.scale(scaleFactor, scaleFactor);
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, 1080 / scaleFactor, 1920 / scaleFactor);
            ctx.fillStyle = "#f1f1f1";
            ctx.font = "36px Familjen Grotesk, sans-serif";
        },

        downloadCanvas() {
            const canvas = this.$refs[`portraitCanvas${this.selectedCanvas + 1}`][0];
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = `music-journey-${this.selectedCanvas + 1}.png`;
            link.click();
        },

        async shareCanvas() {
            const canvas = this.$refs[`portraitCanvas${this.selectedCanvas + 1}`][0];
            const dataUrl = canvas.toDataURL("image/png");

            try {
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], `portrait-layout-${this.selectedCanvas + 1}.png`, { type: blob.type });

                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: `${this.userName}'s Music Journey`,
                        text: 'Check out my music journey from Spütify!',
                    });
                } else {
                    alert("Sharing this file is not supported on your device.");
                }
            } catch (error) {
                console.error("Sharing failed:", error);
            }
        },

        previousCanvas() {
            this.selectedCanvas = (this.selectedCanvas - 1 + this.canvases.length) % this.canvases.length;
        },

        nextCanvas() {
            this.selectedCanvas = (this.selectedCanvas + 1) % this.canvases.length;
        },

        selectCanvas(index) {
            this.selectedCanvas = index;
        },
        onTouchStart(event) {
            this.touchStartX = event.changedTouches[0].clientX;
            if (!this.shown) {
                this.shown = true;
                this.showSwipeInfo();
            }
        },
        onTouchMove(event) {
            this.touchEndX = event.changedTouches[0].clientX;
        },
        onTouchEnd() {
            const swipeDistance = this.touchStartX - this.touchEndX;
            const swipeThreshold = 50;

            if (swipeDistance > swipeThreshold) {
                this.nextCanvas();
            } else if (swipeDistance < -swipeThreshold) {
                this.previousCanvas();
            }
        },
        showSwipeInfo() {
            const swipeElement = document.querySelector('.swipe');
            if (swipeElement) {
                swipeElement.style.opacity = '0.8';
                setTimeout(() => {
                    swipeElement.style.opacity = '0';
                }, 2000);
            }
        }
    }
};
</script>

<style scoped>
h4 {
    margin-bottom: 20px;
}

h2 {
    margin-bottom: 0;
    margin-left: 5vw;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
}

.button-container {
    width: 80vw;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
    margin-bottom: 2rem;
}

.share-button {
    background-color: rgba(255, 255, 255, 0.8);
    color: black;
    transition-duration: 0.4s;
}

.share-button:hover {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.6);
}

.portrait-container {
    width: 100vw;
    overflow: hidden;
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 5rem 0;
    transition: transform 0.5s ease-in-out;
}

.portrait {
    display: flex;
    gap: 10px;
    padding: 10px;
    background-color: #2e2e2e;
    border-radius: 15px;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
    transition: all 0.3s ease-in-out;
    filter: brightness(0.4);
    z-index: 2;
    transform: scale(0.8);
}

.portrait.selected {
    transform: scale(1);
    filter: brightness(1);
    z-index: 3;
}

canvas {
    border-radius: 10px;
    width: 270px;
    height: 480px;
}

.canvas-container {
    display: flex;
}

.arrow {
    position: relative;
    top: 50%;
    background-color: transparent;
    color: #555;
    border: none;
    cursor: pointer;
    z-index: 4;
    outline: none;

    .material-symbols-rounded {
        font-size: 3rem !important;
        text-shadow: 0 0 0.5rem black;
    }
}

.arrow.left-arrow {
    left: 38vw;
}

.arrow.right-arrow {
    right: 38vw;
}

.arrow:hover {
    color: #fff;
}

.share {
    transform: scale(0.9);
}

.swipe {
    position: absolute;
    z-index: 99;
    transform: translate(calc(50vw - 50%), 25vh);
    font-size: 4rem;
    color: rgba(255, 255, 255, 0.8);
    background: #333;
    opacity: 0;
    padding: 0.5rem;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 1rem rgba(0, 0, 0, 0.8);
    transition: opacity 0.5s;
}

@media screen and (max-width: 1000px) {
    .arrow {
        display: none;
    }

}
</style>
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
import birdoSrc from '@/assets/image1.png';
import fadeSrc from '@/assets/fade.png';
import bgSrc from '@/assets/share_bg_1.png';
import bg2Src from '@/assets/share_bg_2.png';
import logoSrc from '@/assets/spütify_logo.png';

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
        drawTextWithHyphenation(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
            const words = text.split(' ');
            let line = '';
            let yOffset = 0;
            let lines = 0;

            words.forEach((word) => {
                let testLine = line + word + ' ';
                let metrics = ctx.measureText(testLine);
                let testWidth = metrics.width;

                if (testWidth > maxWidth && line !== '') {
                    ctx.fillText(line, x, y + yOffset);
                    lines++;
                    if (lines >= maxLines) {
                        return;
                    }
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
                    if (lines >= maxLines) {
                        return;
                    }
                    word = word.slice(i);
                    yOffset += lineHeight;
                }

                line += word + ' ';
            });
            ctx.fillText(line, x, y + yOffset);
        },
        drawOnCanvas1(canvas) {
            const ctx = canvas.getContext("2d");
            this.clearCanvas(ctx);
            this.setCanvasStyle(ctx);


            const image = new Image();
            image.src = bgSrc;
            image.onload = () => {
                ctx.drawImage(image, 0, 0, 540, 960);
                drawText();
            };
            image.onerror = () => {
                console.error("Error loading image for canvas1.");
                drawText();
            };

            const drawText = () => {
                const gradient = ctx.createLinearGradient(50, 0, canvas.width / 2, 0);
                gradient.addColorStop(0, "#1DB954");
                gradient.addColorStop(1, "#4DD4AC");
                ctx.fillStyle = gradient;
                ctx.font = "36px FranieBlack, sans-serif";
                const lines = `${this.userName}'s \nmusic journey`.split('\n');
                lines.forEach((line, index) => {
                    ctx.fillText(line, 50, 80 + index * 45);
                });

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

                    let maxWidth = 200;
                    let x = 80;
                    let y = 240 + index * 150;
                    const lineHeight = 30;
                    let line = '';
                    let yOffset = 0;
                    let lines = 0;

                    const [icon, ...songName] = topTrackText.split(' ');
                    ctx.font = "30px Material Symbols Rounded, sans-serif";
                    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                    ctx.fillText(icon, x - 35, y + 6);

                    ctx.font = "28px Familjen Grotesk, sans-serif";
                    ctx.fillStyle = "rgba(255, 255, 255, 1)";
                    songName.join(' ').split(' ').forEach(word => {
                        let testLine = line + word + ' ';
                        let metrics = ctx.measureText(testLine);
                        let testWidth = metrics.width;

                        if (testWidth > maxWidth && line !== '') {
                            ctx.fillText(line, x, y + yOffset);
                            lines++;
                            if (lines >= 3) {
                                return;
                            }
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
                            if (lines >= 3) {
                                return;
                            }
                            word = word.slice(i);
                            yOffset += lineHeight;
                        }

                        line += word + ' ';
                    });
                    ctx.fillText(line, x, y + yOffset);

                    maxWidth = 150;
                    let line2 = '';
                    let yOffset2 = 0;
                    x = 340;
                    lines = 0;

                    const [icon2, ...artistName] = topArtistText.split(' ');
                    ctx.font = "36px Material Symbols Rounded, sans-serif";
                    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                    ctx.fillText(icon2, x - 42, y + 8);

                    ctx.font = "28px Familjen Grotesk, sans-serif";
                    ctx.fillStyle = "rgba(255, 255, 255, 1)";
                    artistName.join(' ').split(' ').forEach(word => {
                        let testLine = line2 + word + ' ';
                        let metrics = ctx.measureText(testLine);
                        let testWidth = metrics.width;

                        if (testWidth > maxWidth && line2 !== '') {
                            ctx.fillText(line2, x, y + yOffset2);
                            lines++;
                            if (lines >= 3) {
                                return;
                            }
                            line2 = '';
                            yOffset2 += lineHeight;
                        }

                        while (ctx.measureText(word).width > maxWidth) {
                            let i = 1;
                            while (ctx.measureText(word.slice(0, i) + '-').width <= maxWidth && i < word.length) {
                                i++;
                            }
                            i--;
                            ctx.fillText(word.slice(0, i) + '-', x, y + yOffset2);
                            lines++;
                            if (lines >= 3) {
                                return;
                            }
                            word = word.slice(i);
                            yOffset2 += lineHeight;
                        }

                        line2 += word + ' ';
                    });
                    ctx.fillText(line2, x, y + yOffset2);
                });

                const image2 = new Image();
                image2.src = fadeSrc;
                image2.onload = () => {
                    ctx.drawImage(image2, 490, 0, 50, 960);
                    const image3 = new Image();
                    image3.src = fadeSrc;
                    image3.onload = () => {
                        ctx.save();
                        ctx.scale(-1, 1);
                        ctx.drawImage(image3, -50, 0, 50, 960);
                        ctx.restore();
                        const logoImage = new Image();
                        logoImage.src = logoSrc;
                        logoImage.onload = () => {
                            ctx.drawImage(logoImage, 340, 910, 176.32, 35.52);
                        };
                        logoImage.onerror = () => {
                            console.error("Error loading Spütify logo.");
                        };
                    };
                    image3.onerror = () => {
                        console.error("Error loading image for canvas1.");
                    };
                };
                image2.onerror = () => {
                    console.error("Error loading image for canvas1.");
                };
            }
        },
        drawOnCanvas2(canvas) {
            const ctx = canvas.getContext("2d");
            this.clearCanvas(ctx);
            this.setCanvasStyle(ctx);

            const image = new Image();
            image.src = bg2Src;
            image.onload = () => {
                ctx.drawImage(image, 0, 0, 540, 960);
                drawText();
            };
            image.onerror = () => {
                console.error("Error loading image for canvas1.");
                drawText();
            };

            const drawText = () => {
                const gradient = ctx.createLinearGradient(50, 0, canvas.width / 2, 0);
                gradient.addColorStop(0, "#1DB954");
                gradient.addColorStop(1, "#4DD4AC");
                ctx.fillStyle = gradient;
                const lines = `${this.userName}'s \ncurrent favorites`.split('\n');
                lines.forEach((line, index) => {
                    ctx.font = "bold 36px FranieBlack, sans-serif";
                    ctx.fillText(line, 50, 80 + index * 45);
                    ctx.fillStyle = gradient;
                });

                ctx.fillStyle = "rgba(255, 255, 255, 1)";
                const { topTracks = [], topArtists = [], topGenres = [] } = this.years[1] || {};
                const topTracksText = `Top Songs\n${topTracks.map((track, index) => `${index + 1} ${track.name}`).join("\n")}`;
                const topTracksLines = topTracksText.split('\n');
                topTracksLines.forEach((line, index) => {
                    if (index === 0) {
                        ctx.font = "28px FranieSemiBold, sans-serif";
                        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                        ctx.fillText(line, 50, 200);
                    } else {
                        const [number, ...trackName] = line.split(' ');
                        ctx.font = "bold 28px Familjen Grotesk, sans-serif";
                        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                        ctx.fillText(number, 50, 240 + (index - 1) * 35);
                        ctx.font = "28px Familjen Grotesk, sans-serif";
                        ctx.fillStyle = "rgba(255, 255, 255, 1)";
                        this.drawTextWithHyphenation(ctx, trackName.join(' '), 80, 240 + (index - 1) * 35, 400, 35, 3);
                    }
                });

                const topArtistsText = `Top Artists\n${topArtists.map((artist, index) => `${index + 1} ${artist.name}`).join("\n")}`;
                const topArtistsLines = topArtistsText.split('\n');
                topArtistsLines.forEach((line, index) => {
                    if (index === 0) {
                        ctx.font = "28px FranieSemiBold, sans-serif";
                        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                        ctx.fillText(line, 50, 450);
                    } else {
                        const [number, ...artistName] = line.split(' ');
                        ctx.font = "bold 28px Familjen Grotesk, sans-serif";
                        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                        ctx.fillText(number, 50, 490 + (index - 1) * 35);
                        ctx.font = "28px Familjen Grotesk, sans-serif";
                        ctx.fillStyle = "rgba(255, 255, 255, 1)";
                        this.drawTextWithHyphenation(ctx, artistName.join(' '), 80, 490 + (index - 1) * 35, 400, 35, 3);
                    }
                });

                const topGenresText = `Top Genres\n${topGenres.map((genre, index) => `${index + 1} ${genre.name}`).join("\n")}`;
                const topGenresLines = topGenresText.split('\n');
                topGenresLines.forEach((line, index) => {
                    if (index === 0) {
                        ctx.font = "28px FranieSemiBold, sans-serif";
                        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                        ctx.fillText(line, 50, 700);
                    } else {
                        const [number, ...trackName] = line.split(' ');
                        ctx.font = "bold 28px Familjen Grotesk, sans-serif";
                        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                        ctx.fillText(number, 50, 740 + (index - 1) * 35);
                        ctx.font = "28px Familjen Grotesk, sans-serif";
                        ctx.fillStyle = "rgba(255, 255, 255, 1)";
                        this.drawTextWithHyphenation(ctx, trackName.join(' '), 80, 740 + (index - 1) * 35, 400, 35, 3);
                    }
                });

                const image2 = new Image();
                image2.src = fadeSrc;
                image2.onload = () => {
                    ctx.drawImage(image2, 490, 0, 50, 960);
                    const image3 = new Image();
                    image3.src = fadeSrc;
                    image3.onload = () => {
                        ctx.save();
                        ctx.scale(-1, 1);
                        ctx.drawImage(image3, -50, 0, 50, 960);
                        ctx.restore();
                        const logoImage = new Image();
                        logoImage.src = logoSrc;
                        logoImage.onload = () => {
                            ctx.drawImage(logoImage, 340, 910, 176.32, 35.52);
                        };
                        logoImage.onerror = () => {
                            console.error("Error loading Spütify logo.");
                        };
                    };
                    image3.onerror = () => {
                        console.error("Error loading image for canvas1.");
                    };
                };
                image2.onerror = () => {
                    console.error("Error loading image for canvas1.");
                };
            };
        },
        drawOnCanvas3(canvas) {
            const ctx = canvas.getContext("2d");
            this.clearCanvas(ctx);
            this.setCanvasStyle(ctx);


            const image = new Image();
            image.src = bgSrc;
            image.onload = () => {
                ctx.drawImage(image, 0, 0, 540, 960);
                drawText();
            };
            image.onerror = () => {
                console.error("Error loading image for canvas1.");
                drawText();
            };

            const drawText = () => {
                const gradient = ctx.createLinearGradient(50, 0, canvas.width / 2, 0);
                gradient.addColorStop(0, "#1DB954");
                gradient.addColorStop(1, "#4DD4AC");
                ctx.fillStyle = gradient;
                ctx.font = "bold 36px FranieBlack, sans-serif";
                const lines = `${this.userName}'s \ntop artists\nover the years`.split('\n');
                lines.forEach((line, index) => {
                    ctx.fillText(line, 50, 80 + index * 45);
                });

                this.years.forEach((year, index) => {
                    if (index !== 0 && index < 7) {
                        const yearText = `${year.title}`;
                        const topArtistText = `${year.topArtists[0]?.name || "No data"}`;

                        const artistImage = new Image();
                        artistImage.src = year.topArtists[0]?.images[0].url || '@/assets/user.png';
                        artistImage.onload = () => {
                            ctx.save();
                            ctx.beginPath();
                            ctx.arc(90, 151 + index * 110, 40, 0, Math.PI * 2, true);
                            ctx.closePath();
                            ctx.clip();
                            ctx.drawImage(artistImage, 50, 111 + index * 110, 80, 80);
                            ctx.restore();
                        };
                        artistImage.onerror = () => {
                            console.error("Error loading artist image.");
                        };

                        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                        ctx.font = "28px FranieSemiBold, sans-serif";
                        ctx.fillText(yearText, 150, 145 + index * 110);

                        ctx.font = "28px Familjen Grotesk, sans-serif";
                        ctx.fillStyle = "rgba(255, 255, 255, 1)";
                        this.drawTextWithHyphenation(ctx, topArtistText, 150, 180 + index * 110, 340, 35, 3);
                    }
                });

                const image2 = new Image();
                image2.src = fadeSrc;
                image2.onload = () => {
                    ctx.drawImage(image2, 490, 0, 50, 960);
                    const image3 = new Image();
                    image3.src = fadeSrc;
                    image3.onload = () => {
                        ctx.save();
                        ctx.scale(-1, 1);
                        ctx.drawImage(image3, -50, 0, 50, 960);
                        ctx.restore();
                        const logoImage = new Image();
                        logoImage.src = logoSrc;
                        logoImage.onload = () => {
                            ctx.drawImage(logoImage, 340, 910, 176.32, 35.52);
                        };
                        logoImage.onerror = () => {
                            console.error("Error loading Spütify logo.");
                        };
                    };
                    image3.onerror = () => {
                        console.error("Error loading image for canvas1.");
                    };
                };
                image2.onerror = () => {
                    console.error("Error loading image for canvas1.");
                };
            }
        },
        drawOnCanvas4(canvas) {
            const ctx = canvas.getContext("2d");
            this.clearCanvas(ctx);
            this.setCanvasStyle(ctx);


            const image = new Image();
            image.src = bg2Src;
            image.onload = () => {
                ctx.drawImage(image, 0, 0, 540, 960);
                drawText();
            };
            image.onerror = () => {
                console.error("Error loading image for canvas1.");
                drawText();
            };

            const drawText = () => {
                const gradient = ctx.createLinearGradient(50, 0, canvas.width / 2, 0);
                gradient.addColorStop(0, "#1DB954");
                gradient.addColorStop(1, "#4DD4AC");
                ctx.fillStyle = gradient;
                ctx.font = "bold 36px FranieBlack, sans-serif";
                const lines = `${this.userName}'s \ntop songs\nover the years`.split('\n');
                lines.forEach((line, index) => {
                    ctx.fillText(line, 50, 80 + index * 45);
                });

                this.years.forEach((year, index) => {
                    if (index !== 0 && index < 7) {
                        const yearText = `${year.title}`;
                        const topTrackText = `${year.topTracks[0]?.name || "No data"}`;

                        const trackImage = new Image();
                        trackImage.src = year.topTracks[0]?.album?.images[0].url || '@/assets/user.png';
                        trackImage.onload = () => {
                            ctx.save();
                            ctx.drawImage(trackImage, 50, 111 + index * 110, 80, 80);
                            ctx.restore();
                        };
                        trackImage.onerror = () => {
                            console.error("Error loading track image.");
                        };

                        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                        ctx.font = "28px FranieSemiBold, sans-serif";
                        ctx.fillText(yearText, 150, 145 + index * 110);

                        ctx.font = "28px Familjen Grotesk, sans-serif";
                        ctx.fillStyle = "rgba(255, 255, 255, 1)";
                        ctx.fillText(topTrackText, 150, 180 + index * 110);
                    }
                });

                const image2 = new Image();
                image2.src = fadeSrc;
                image2.onload = () => {
                    ctx.drawImage(image2, 490, 0, 50, 960);
                    const image3 = new Image();
                    image3.src = fadeSrc;
                    image3.onload = () => {
                        ctx.save();
                        ctx.scale(-1, 1);
                        ctx.drawImage(image3, -50, 0, 50, 960);
                        ctx.restore();
                        const logoImage = new Image();
                        logoImage.src = logoSrc;
                        logoImage.onload = () => {
                            ctx.drawImage(logoImage, 340, 910, 176.32, 35.52);
                        };
                        logoImage.onerror = () => {
                            console.error("Error loading Spütify logo.");
                        };
                    };
                    image3.onerror = () => {
                        console.error("Error loading image for canvas1.");
                    };
                };
                image2.onerror = () => {
                    console.error("Error loading image for canvas1.");
                };
            }
        },
        drawOnCanvas5(canvas) {
            const ctx = canvas.getContext("2d");
            this.clearCanvas(ctx);
            this.setCanvasStyle(ctx);

            const image = new Image();
            image.src = bgSrc;
            image.onload = () => {
                ctx.drawImage(image, 0, 0, 540, 960);
                drawText();
            };
            image.onerror = () => {
                console.error("Error loading image for canvas5.");
                drawText();
            };

            const drawText = () => {
                const gradient = ctx.createLinearGradient(50, 0, canvas.width / 2, 0);
                gradient.addColorStop(0, "#1DB954");
                gradient.addColorStop(1, "#4DD4AC");
                ctx.fillStyle = gradient;
                ctx.font = "36px FranieBlack, sans-serif";
                const lines = `${this.userName}'s \nbadges`.split('\n');
                lines.forEach((line, index) => {
                    ctx.fillText(line, 50, 80 + index * 45);
                });

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

                const image2 = new Image();
                image2.src = fadeSrc;
                image2.onload = () => {
                    ctx.drawImage(image2, 490, 0, 50, 960);
                    const image3 = new Image();
                    image3.src = fadeSrc;
                    image3.onload = () => {
                        ctx.save();
                        ctx.scale(-1, 1);
                        ctx.drawImage(image3, -50, 0, 50, 960);
                        ctx.restore();
                        const logoImage = new Image();
                        logoImage.src = logoSrc;
                        logoImage.onload = () => {
                            ctx.drawImage(logoImage, 340, 910, 176.32, 35.52);
                        };
                        logoImage.onerror = () => {
                            console.error("Error loading Spütify logo.");
                        };
                    };
                    image3.onerror = () => {
                        console.error("Error loading image for canvas5.");
                    };
                };
                image2.onerror = () => {
                    console.error("Error loading image for canvas5.");
                };
            };
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
            link.download = `portrait-layout-${this.selectedCanvas + 1}.png`;
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
                        title: 'Check out this image!',
                        text: `Here's the image I generated: Image ${this.selectedCanvas + 1}`,
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
            const swipeThreshold = 50; // Minimum distance to detect a swipe

            if (swipeDistance > swipeThreshold) {
                // Swipe left
                this.nextCanvas();
            } else if (swipeDistance < -swipeThreshold) {
                // Swipe right
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
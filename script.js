// Sorting Visualizer - script.js
class SortingVisualizer {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.algoSelect = document.getElementById('algo-select');
        this.sizeSlider = document.getElementById('size-slider');
        this.sizeValue = document.getElementById('size-value');
        this.speedSlider = document.getElementById('speed-slider');
        this.speedValue = document.getElementById('speed-value');
        this.shuffleBtn = document.getElementById('shuffle-btn');
        this.sortBtn = document.getElementById('sort-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.stats = document.getElementById('stats');

        this.array = [];
        this.arraySize = 50;
        this.delay = 50;
        this.isSorting = false;
        this.isPaused = false;
        this.comparisons = 0;
        this.swaps = 0;

        this.resizeCanvas();
        this.initEventListeners();
        this.generateArray();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.draw();
    }

    initEventListeners() {
        this.sizeSlider.addEventListener('input', (e) => {
            this.sizeValue.textContent = e.target.value;
            this.arraySize = parseInt(e.target.value);
            if (!this.isSorting) {
                this.generateArray();
            }
        });

        this.speedSlider.addEventListener('input', (e) => {
            this.speedValue.textContent = e.target.value;
            this.delay = 150 - (parseInt(e.target.value) / 100) * 140; // 10-150ms
        });

        this.shuffleBtn.addEventListener('click', () => {
            this.generateArray();
            this.isSorting = false;
            this.sortBtn.textContent = 'Sort';
            this.pauseBtn.textContent = 'Pause';
        });

        this.sortBtn.addEventListener('click', () => this.startSort());

        this.pauseBtn.addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            this.pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
        });

        this.resetBtn.addEventListener('click', () => {
            this.isSorting = false;
            this.isPaused = false;
            this.generateArray();
            this.sortBtn.textContent = 'Sort';
            this.pauseBtn.textContent = 'Pause';
            this.comparisons = 0;
            this.swaps = 0;
            this.updateStats();
        });
    }

    generateArray() {
        this.array = [];
        for (let i = 0; i < this.arraySize; i++) {
            this.array[i] = Math.floor(Math.random() * 300) + 10;
        }
        this.draw();
    }

    async startSort() {
        if (this.isSorting) return;
        this.isSorting = true;
        this.isPaused = false;
        this.sortBtn.textContent = 'Sorting...';
        this.pauseBtn.textContent = 'Pause';
        this.comparisons = 0;
        this.swaps = 0;

        const algo = this.algoSelect.value;
        switch (algo) {
            case 'bubble': await this.bubbleSort(); break;
            case 'selection': await this.selectionSort(); break;
            case 'insertion': await this.insertionSort(); break;
            case 'merge': await this.mergeSort(); break;
            case 'quick': await this.quickSort(0, this.array.length - 1); break;
        }

        this.isSorting = false;
        this.sortBtn.textContent = 'Sort';
    }

    async sleep() {
        return new Promise(resolve => setTimeout(resolve, this.delay));
    }

    updateStats() {
        this.stats.textContent = `Comparisons: ${this.comparisons} | Swaps: ${this.swaps}`;
    }

    draw() {
        const ctx = this.ctx;
        const cw = this.canvas.width;
        const ch = this.canvas.height;
        const barWidth = cw / this.arraySize;
        const maxHeight = ch - 50;

        ctx.clearRect(0, 0, cw, ch);

        this.array.forEach((val, i) => {
            const barHeight = (val / 310) * maxHeight;
            const x = i * barWidth;
            const gradient = ctx.createLinearGradient(x, ch, x + barWidth, ch - barHeight);
            
            if (this.isSorting) {
                gradient.addColorStop(0, '#00d4ff');
                gradient.addColorStop(1, '#0099cc');
            } else if (this.array[i] === Math.max(...this.array)) {
                gradient.addColorStop(0, '#ff6b9d');
                gradient.addColorStop(1, '#ff4757');
            } else {
                gradient.addColorStop(0, '#4facfe');
                gradient.addColorStop(1, '#00f2fe');
            }

            ctx.fillStyle = gradient;
            ctx.fillRect(x, ch - barHeight, barWidth - 1, barHeight);
            
            if (this.isSorting) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(val.toString(), x + barWidth / 2, ch - barHeight - 5);
            }
        });
    }

    // Bubble Sort
    async bubbleSort() {
        for (let i = 0; i < this.array.length; i++) {
            for (let j = 0; j < this.array.length - i - 1; j++) {
                if (this.isPaused) await this.waitForResume();
                this.comparisons++;
                if (this.array[j] > this.array[j + 1]) {
                    [this.array[j], this.array[j + 1]] = [this.array[j + 1], this.array[j]];
                    this.swaps++;
                }
                this.draw();
                this.updateStats();
                await this.sleep();
            }
        }
    }

    // Selection Sort
    async selectionSort() {
        for (let i = 0; i < this.array.length; i++) {
            let minIdx = i;
            for (let j = i + 1; j < this.array.length; j++) {
                if (this.isPaused) await this.waitForResume();
                this.comparisons++;
                if (this.array[j] < this.array[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx !== i) {
                [this.array[i], this.array[minIdx]] = [this.array[minIdx], this.array[i]];
                this.swaps++;
            }
            this.draw();
            this.updateStats();
            await this.sleep();
        }
    }

    // Insertion Sort
    async insertionSort() {
        for (let i = 1; i < this.array.length; i++) {
            let key = this.array[i];
            let j = i - 1;
            while (j >= 0 && this.array[j] > key) {
                if (this.isPaused) await this.waitForResume();
                this.comparisons++;
                this.array[j + 1] = this.array[j];
                this.swaps++;
                j--;
                this.draw();
                this.updateStats();
                await this.sleep();
            }
            this.array[j + 1] = key;
            this.draw();
            await this.sleep();
        }
    }

    // Merge Sort
    async mergeSort(low = 0, high = this.array.length - 1) {
        if (low < high) {
            const mid = Math.floor((low + high) / 2);
            await this.mergeSort(low, mid);
            await this.mergeSort(mid + 1, high);
            await this.merge(low, mid, high);
        }
    }

    async merge(low, mid, high) {
        const left = this.array.slice(low, mid + 1);
        const right = this.array.slice(mid + 1, high + 1);
        let i = 0, j = 0, k = low;

        while (i < left.length && j < right.length) {
            if (this.isPaused) await this.waitForResume();
            this.comparisons++;
            if (left[i] <= right[j]) {
                this.array[k++] = left[i++];
            } else {
                this.array[k++] = right[j++];
                this.swaps++;
            }
            this.draw();
            this.updateStats();
            await this.sleep();
        }

        while (i < left.length) {
            this.array[k++] = left[i++];
        }
        while (j < right.length) {
            this.array[k++] = right[j++];
        }
    }

    // Quick Sort
    async quickSort(low, high) {
        if (low < high) {
            const pi = await this.partition(low, high);
            await this.quickSort(low, pi - 1);
            await this.quickSort(pi + 1, high);
        }
    }

    async partition(low, high) {
        const pivot = this.array[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (this.isPaused) await this.waitForResume();
            this.comparisons++;
            if (this.array[j] < pivot) {
                i++;
                [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
                this.swaps++;
            }
            this.draw();
            this.updateStats();
            await this.sleep();
        }
        [this.array[i + 1], this.array[high]] = [this.array[high], this.array[i + 1]];
        this.swaps++;
        return i + 1;
    }

    async waitForResume() {
        while (this.isPaused) {
            await this.sleep();
        }
    }
}

// Initialize visualizer
new SortingVisualizer();


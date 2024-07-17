function msToMinsSecondsMilliseconds(ms) {
  return {
    m: Math.floor(ms / 60000),
    s: Math.floor((ms % 60000) / 1000),
    ms: Math.floor(ms % 1000),
  };
}

export function makeTimeString(elapsed) {
  return `${String(elapsed.m).padStart(2, '0')}:${String(elapsed.s).padStart(
    2,
    '0'
  )}.${String(elapsed.ms).padStart(3, '0')}`;
}

class Stopwatch {
  constructor(setState) {
    this.setState = setState;
    this.interval = null;
    this.startTime = null;
    this.endTime = null;
    this.elapsed = { m: 0, s: 0, ms: 0 };
    this.timeString = makeTimeString(this.elapsed);
  }

  func() {
    const delta = Date.now() - this.startTime; // milliseconds elapsed since start
    this.elapsed = msToMinsSecondsMilliseconds(delta);
    this.timeString = makeTimeString(this.elapsed);
    this.setState(this.elapsed);
  }

  start() {
    this.startTime = Date.now();
    this.interval = setInterval(() => {
      this.func();
    }, 2); // update about every 10ms
  }

  stop() {
    clearInterval(this.interval);
  }

  reset() {
    this.elapsed = { m: 0, s: 0, ms: 0 };
    this.timeString = makeTimeString(this.elapsed);
    this.setState(this.elapsed);
  }
}

export default Stopwatch;

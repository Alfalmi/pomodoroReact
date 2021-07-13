function App() {
  const [displayTime, setDisplayTime] = React.useState(1500);
  const [breakTime, setBreakTime] = React.useState(5);
  const [sessionTime, setSessionTime] = React.useState(25);
  const [timerOn, setTimerOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);

  const [breakAudio, setBreakAudio] = React.useState(new Audio('./breakTime.mp3'));
//  const [displayTime, setDisplayTime] = useState(1500);
//  const [breakTime, setBreakTime] = useState(5);
//  const [sessionTime, setSessionTime] = useState(25);
//  const [timerOn, setTimerOn] = useState(false);
  const [timerId, setTimerId] = React.useState("Session");
// const audioElement = useRef(null);
// let loop = undefined;


  const playBreakSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  }

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);

    return minutes;
  };
  const formatDisplay = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return minutes + ':' + seconds;
  };

  const changeTime = (amount, type) => {
    let newCount;
    if (type === "session") {
      newCount = sessionTime + amount;
    } else {
      newCount = breakTime + amount;
    }

    if (newCount > 0 && newCount <= 60 && !timerOn) {
      type === "session" ? setSessionTime(newCount) : setBreakTime(newCount);
      if (type === "session") {
        setDisplayTime(newCount * 60);
      }
    }
  };


  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              playBreakSound();
              onBreakVariable = true;
              setOnBreak(true)
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
              playBreakSound();
              onBreakVariable = false;
              setOnBreak(false)
              return sessionTime;
            }
            return prev - 1;
          });
          nextDate += second;
        }

      }, 30);

      localStorage.clear();
      localStorage.setItem('interval-id', interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);

  };
  const resetTime = () => {
    setDisplayTime(1500);
    setBreakTime(5);
    setSessionTime(25);
    setTimerId("Session");
    setOnBreak(false);
    clearInterval(localStorage.getItem("interval-id"));
    setTimerOn(false);

  };

  return (
    <div className="center-align">
      <h1>Pomodoro Clock</h1>
      <div className="dual-container">
        <Length
          id="break-label"
          title="Break Length"
          changeTime={changeTime}
          type={"break"}
          time={breakTime}
          formatTime={formatTime}
          minID="break-decrement"
          addID="break-increment"
          lengthID="break-length"
        />
        <Length
          id="session-label"
          title="Session Length"
          changeTime={changeTime}
          type={"session"}
          time={sessionTime}
          formatTime={formatTime}
          minID="session-decrement"
          addID="session-increment"
          lengthID="session-length"
        />

      </div>
      <div className="timer-container">
      <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
      <h1 id="time-left">{formatDisplay(displayTime)}</h1>
      <button id="start_stop" className="btn-large deep-orange" onClick={controlTime}>
        {timerOn ? (
          <i className="material-icons">pause_circle_filled</i>
        ) : (
          <i className="material-icons">play_circle_filled</i>
        )}
      </button>
      <button id="reset" className="btn-large deep-orange" onClick={resetTime}>
        <i className="material-icons">autorenew</i>
      </button>
    </div>
    </div>
  );
}

function Length({ id, title, changeTime, type, time, formatTime, minID, addID, lengthID }) {
  return (
    <div>
      <div id={id}>{title}</div>
      <div className="time-sets">
        <button id={minID} className="btn-small deep-orange darken-1" onClick={() => changeTime(-1, type)}
        >
          <i className="material-icons">arrow_drop_down</i>
        </button>
        <h3 id={lengthID}>{time}</h3>
        <button id={addID} className="btn-small deep-orange darken-1" onClick={() => changeTime(+1, type)}
        >
          <i className="material-icons">arrow_drop_up</i>
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

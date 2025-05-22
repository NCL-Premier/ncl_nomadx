document.addEventListener('DOMContentLoaded', () => {
    // Get elements for displaying scores
    const team1NameEl = document.getElementById('team1-name');
    const team1RunsEl = document.getElementById('team1-runs');
    const team1WicketsEl = document.getElementById('team1-wickets');
    const team1OversEl = document.getElementById('team1-overs');

    const team2NameEl = document.getElementById('team2-name');
    const team2RunsEl = document.getElementById('team2-runs');
    const team2WicketsEl = document.getElementById('team2-wickets');
    const team2OversEl = document.getElementById('team2-overs');

    const matchStatusEl = document.getElementById('match-status');

    // Get elements for updating scores (admin controls)
    const currentTeamSelect = document.getElementById('current-team');
    const runsInput = document.getElementById('runs-input');
    const wicketsInput = document.getElementById('wickets-input');
    const oversInput = document.getElementById('overs-input');
    const matchStatusInput = document.getElementById('match-status-input');
    const updateScoreBtn = document.getElementById('update-score-btn');

    // Initial match data (NCL Nomads vs. Opponent Team as default)
    let matchData = {
        team1: {
            name: "NCL Nomads",
            runs: 0,
            wickets: 0,
            overs: "0.0"
        },
        team2: {
            name: "Opponent Team",
            runs: 0,
            wickets: 0,
            overs: "0.0"
        },
        status: "Match not started yet."
    };

    // Function to load data from local storage
    function loadMatchData() {
        const storedData = localStorage.getItem('nclNomadsMatchData');
        if (storedData) {
            matchData = JSON.parse(storedData);
        }
    }

    // Function to save data to local storage
    function saveMatchData() {
        localStorage.setItem('nclNomadsMatchData', JSON.stringify(matchData));
    }

    // Function to update the displayed scores
    function updateDisplay() {
        team1NameEl.textContent = matchData.team1.name;
        team1RunsEl.textContent = matchData.team1.runs;
        team1WicketsEl.textContent = matchData.team1.wickets;
        team1OversEl.textContent = matchData.team1.overs;

        team2NameEl.textContent = matchData.team2.name;
        team2RunsEl.textContent = matchData.team2.runs;
        team2WicketsEl.textContent = matchData.team2.wickets;
        team2OversEl.textContent = matchData.team2.overs;

        matchStatusEl.textContent = matchData.status;

        // Update input fields with current values for the selected team
        const selectedTeam = currentTeamSelect.value;
        if (selectedTeam === 'team1') {
            runsInput.value = matchData.team1.runs;
            wicketsInput.value = matchData.team1.wickets;
            oversInput.value = matchData.team1.overs;
        } else if (selectedTeam === 'team2') {
            runsInput.value = matchData.team2.runs;
            wicketsInput.value = matchData.team2.wickets;
            oversInput.value = matchData.team2.overs;
        }
        matchStatusInput.value = matchData.status; // Always update status input
    }

    // Event listener for the update button
    updateScoreBtn.addEventListener('click', () => {
        const selectedTeam = currentTeamSelect.value;
        const newRuns = parseInt(runsInput.value);
        const newWickets = parseInt(wicketsInput.value);
        let newOvers = oversInput.value; // Keep as string for "X.Y" format
        const newStatus = matchStatusInput.value;

        // Basic validation
        if (isNaN(newRuns) || newRuns < 0) {
            alert('Please enter valid runs.');
            return;
        }
        if (isNaN(newWickets) || newWickets < 0 || newWickets > 10) {
            alert('Please enter valid wickets (0-10).');
            return;
        }
        // Basic overs format validation (e.g., allow "5.3" but not "5.7")
        if (!/^\d+(\.\d)?$/.test(newOvers) || parseFloat(newOvers.split('.')[1]) >= 6) {
             // If there's a decimal, ensure the part after is less than 6
            if (newOvers.includes('.') && parseInt(newOvers.split('.')[1]) >= 6) {
                alert('Invalid overs format. Balls should be between 0 and 5 (e.g., 5.3, not 5.6).');
                return;
            }
        }


        if (selectedTeam === 'team1') {
            matchData.team1.runs = newRuns;
            matchData.team1.wickets = newWickets;
            matchData.team1.overs = newOvers;
        } else if (selectedTeam === 'team2') {
            matchData.team2.runs = newRuns;
            matchData.team2.wickets = newWickets;
            matchData.team2.overs = newOvers;
        }
        matchData.status = newStatus;

        saveMatchData();
        updateDisplay();
    });

    // Event listener to populate inputs when changing selected team
    currentTeamSelect.addEventListener('change', updateDisplay);

    // Initial load and display
    loadMatchData();
    updateDisplay();
});
document.addEventListener('DOMContentLoaded', () => {
    // --- Countdown Elements ---
    const countdownDiv = document.getElementById('match-countdown');
    const countdownDaysEl = document.getElementById('countdown-days');
    const countdownHoursEl = document.getElementById('countdown-hours');
    const countdownMinutesEl = document.getElementById('countdown-minutes');
    const countdownSecondsEl = document.getElementById('countdown-seconds');
    const countdownMessageEl = document.getElementById('countdown-message');
    const liveMatchDisplayDiv = document.getElementById('live-match-display'); // The div containing match score

    // --- Live Score Elements ---
    const team1NameEl = document.getElementById('team1-name');
    const team1RunsEl = document.getElementById('team1-runs');
    const team1WicketsEl = document.getElementById('team1-wickets');
    const team1OversEl = document.getElementById('team1-overs');

    const team2NameEl = document.getElementById('team2-name');
    const team2RunsEl = document.getElementById('team2-runs');
    const team2WicketsEl = document.getElementById('team2-wickets');
    const team2OversEl = document.getElementById('team2-overs');

    const matchStatusEl = document.getElementById('match-status'); // This is the status for the live match display

    // --- Admin Control Elements ---
    const currentTeamSelect = document.getElementById('current-team');
    const runsInput = document.getElementById('runs-input');
    const wicketsInput = document.getElementById('wickets-input');
    const oversInput = document.getElementById('overs-input');
    const matchStatusInput = document.getElementById('match-status-input');
    const updateScoreBtn = document.getElementById('update-score-btn');

    // New buttons for forcing display
    const forceLiveBtn = document.getElementById('force-live-btn');
    const revertCountdownBtn = document.getElementById('revert-countdown-btn');


    // --- Match Data (will be loaded from JSON) ---
    let matchData = {};

    // --- Countdown Target Date ---
    // Set your first match date: July 1, 2025, 7:00 PM (19:00) IST
    const targetDate = new Date("July 1, 2025 19:00:00 GMT+0530").getTime(); // GMT+0530 for IST

    // Interval ID for live data fetch
    let liveDataIntervalId;

    // --- Core Display Logic ---
    function updatePageDisplay() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // Check if live match is forced OR if the target date has passed
        if (matchData.isLiveMatchForced || distance < 0) {
            countdownDiv.style.display = 'none'; // Hide countdown
            liveMatchDisplayDiv.style.display = 'block'; // Show live match display
            countdownMessageEl.textContent = "Match is Live!"; // Or "Season has begun!"
            updateLiveScoreDisplay(); // Update scoreboard immediately

            // Start fetching live data if not already running
            if (!liveDataIntervalId) {
                liveDataIntervalId = setInterval(fetchMatchData, 30000); // Fetch every 30 seconds
            }

            // Adjust button visibility
            forceLiveBtn.style.display = 'none';
            revertCountdownBtn.style.display = 'inline-block'; // Show revert button
        } else {
            // Match is in the future and not forced live
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownDaysEl.textContent = String(days).padStart(2, '0');
            countdownHoursEl.textContent = String(hours).padStart(2, '0');
            countdownMinutesEl.textContent = String(minutes).padStart(2, '0');
            countdownSecondsEl.textContent = String(seconds).padStart(2, '0');
            countdownMessageEl.textContent = "Get ready for the NCL Nomads season kickoff!";

            liveMatchDisplayDiv.style.display = 'none'; // Ensure live match display is hidden
            countdownDiv.style.display = 'block'; // Ensure countdown is visible

            // Stop live data fetch interval if running
            if (liveDataIntervalId) {
                clearInterval(liveDataIntervalId);
                liveDataIntervalId = null;
            }

            // Adjust button visibility
            forceLiveBtn.style.display = 'inline-block';
            revertCountdownBtn.style.display = 'none'; // Hide revert button
        }
    }

    // --- Fetch Match Data from score_data.json ---
    async function fetchMatchData() {
        try {
            const response = await fetch('score_data.json?' + new Date().getTime()); // Cache-busting
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const fetchedData = await response.json();
            // Only update matchData if it's actually different to avoid unnecessary UI redraws
            if (JSON.stringify(matchData) !== JSON.stringify(fetchedData)) {
                 matchData = fetchedData;
                 updatePageDisplay(); // Update display based on new data and logic
            }
        } catch (error) {
            console.error("Could not fetch match data:", error);
            // Fallback if data can't be loaded (e.g., first visit before JSON is pushed)
            if (Object.keys(matchData).length === 0) { // Only set fallback if matchData is empty
                matchData = {
                    team1: { name: "NCL Nomads", runs: 0, wickets: 0, overs: "0.0" },
                    team2: { name: "Opponent Team", runs: 0, wickets: 0, overs: "0.0" },
                    status: "Error loading data or match not started.",
                    isLiveMatchForced: false // Default to false
                };
                updatePageDisplay();
            }
        }
    }

    // Function to update the displayed scores (for live match section)
    function updateLiveScoreDisplay() {
        team1NameEl.textContent = matchData.team1.name;
        team1RunsEl.textContent = matchData.team1.runs;
        team1WicketsEl.textContent = matchData.team1.wickets;
        team1OversEl.textContent = matchData.team1.overs;

        team2NameEl.textContent = matchData.team2.name;
        team2RunsEl.textContent = matchData.team2.runs;
        team2WicketsEl.textContent = matchData.team2.wickets;
        team2OversEl.textContent = matchData.team2.overs;

        matchStatusEl.textContent = matchData.status;

        // Update input fields with current values for the selected team
        const selectedTeam = currentTeamSelect.value;
        if (selectedTeam === 'team1') {
            runsInput.value = matchData.team1.runs;
            wicketsInput.value = matchData.team1.wickets;
            oversInput.value = matchData.team1.overs;
        } else if (selectedTeam === 'team2') {
            runsInput.value = matchData.team2.runs;
            wicketsInput.value = matchData.team2.wickets;
            oversInput.value = matchData.team2.overs;
        }
        matchStatusInput.value = matchData.status; // Always update status input
    }

    // --- Event Listeners for Admin Controls ---

    // Update main score
    updateScoreBtn.addEventListener('click', () => {
        const selectedTeam = currentTeamSelect.value;
        const newRuns = parseInt(runsInput.value);
        const newWickets = parseInt(wicketsInput.value);
        let newOvers = oversInput.value;
        const newStatus = matchStatusInput.value;

        // Basic validation (same as before)
        if (isNaN(newRuns) || newRuns < 0) { alert('Please enter valid runs.'); return; }
        if (isNaN(newWickets) || newWickets < 0 || newWickets > 10) { alert('Please enter valid wickets (0-10).'); return; }
        if (newOvers.includes('.') && parseInt(newOvers.split('.')[1]) >= 6) { alert('Invalid overs format. Balls should be between 0 and 5 (e.g., 5.3, not 5.6).'); return; }

        let updatedMatchData = JSON.parse(JSON.stringify(matchData)); // Create a deep copy

        if (selectedTeam === 'team1') {
            updatedMatchData.team1.runs = newRuns;
            updatedMatchData.team1.wickets = newWickets;
            updatedMatchData.team1.overs = newOvers;
        } else if (selectedTeam === 'team2') {
            updatedMatchData.team2.runs = newRuns;
            updatedMatchData.team2.wickets = newWickets;
            updatedMatchData.team2.overs = newOvers;
        }
        updatedMatchData.status = newStatus;

        // Force live if user is updating score and it's not already forced/past target date
        if (!matchData.isLiveMatchForced && (new Date().getTime() < targetDate)) {
             updatedMatchData.isLiveMatchForced = true;
        }

        // Display the JSON output
        const jsonOutput = JSON.stringify(updatedMatchData, null, 2);
        alert("Copy this JSON and update score_data.json on GitHub/Netlify:\n\n" + jsonOutput);

        // Update display immediately for admin feedback
        matchData = updatedMatchData;
        updatePageDisplay(); // Re-evaluate display mode and update scoreboard
    });

    // Force Live Match button
    forceLiveBtn.addEventListener('click', () => {
        let updatedMatchData = JSON.parse(JSON.stringify(matchData));
        updatedMatchData.isLiveMatchForced = true;

        const jsonOutput = JSON.stringify(updatedMatchData, null, 2);
        alert("Copy this JSON and update score_data.json on GitHub/Netlify:\n\n" + jsonOutput);

        matchData = updatedMatchData;
        updatePageDisplay(); // Force re-evaluation of display
    });

    // Revert to Countdown button
    revertCountdownBtn.addEventListener('click', () => {
        let updatedMatchData = JSON.parse(JSON.stringify(matchData));
        updatedMatchData.isLiveMatchForced = false;

        const jsonOutput = JSON.stringify(updatedMatchData, null, 2);
        alert("Copy this JSON and update score_data.json on GitHub/Netlify:\n\n" + jsonOutput);

        matchData = updatedMatchData;
        updatePageDisplay(); // Force re-evaluation of display
    });


    // Event listener to populate inputs when changing selected team
    currentTeamSelect.addEventListener('change', updateLiveScoreDisplay);

    // Initial load and display
    fetchMatchData(); // Initial fetch to get the `isLiveMatchForced` state
    setInterval(updatePageDisplay, 1000); // Keep updating countdown/checking state every second
});
document.addEventListener('DOMContentLoaded', () => {
    // --- Admin Control Elements ---
    const scoreControlsDiv = document.querySelector('.score-controls'); // Select the div by its class
    const urlParams = new URLSearchParams(window.location.search);
    const isAdmin = urlParams.get('admin') === 'true'; // Check for '?admin=true'

    // Show admin controls if '?admin=true' is in the URL
    if (isAdmin) {
        scoreControlsDiv.classList.remove('admin-hidden');
    }

    // --- Countdown Elements (existing) ---
    const countdownDiv = document.getElementById('match-countdown');
    const countdownDaysEl = document.getElementById('countdown-days');
    const countdownHoursEl = document.getElementById('countdown-hours');
    const countdownMinutesEl = document.getElementById('countdown-minutes');
    const countdownSecondsEl = document.getElementById('countdown-seconds');
    const countdownMessageEl = document.getElementById('countdown-message');
    const liveMatchDisplayDiv = document.getElementById('live-match-display');

    // --- Live Score Elements (existing) ---
    const team1NameEl = document.getElementById('team1-name');
    const team1RunsEl = document.getElementById('team1-runs');
    const team1WicketsEl = document.getElementById('team1-wickets');
    const team1OversEl = document.getElementById('team1-overs');

    const team2NameEl = document.getElementById('team2-name');
    const team2RunsEl = document.getElementById('team2-runs');
    const team2WicketsEl = document.getElementById('team2-wickets');
    const team2OversEl = document.getElementById('team2-overs');

    const matchStatusEl = document.getElementById('match-status');

    // --- Admin Input Elements (existing) ---
    const currentTeamSelect = document.getElementById('current-team');
    const runsInput = document.getElementById('runs-input');
    const wicketsInput = document.getElementById('wickets-input');
    const oversInput = document.getElementById('overs-input');
    const matchStatusInput = document.getElementById('match-status-input');
    const updateScoreBtn = document.getElementById('update-score-btn');

    // New buttons for forcing display
    const forceLiveBtn = document.getElementById('force-live-btn');
    const revertCountdownBtn = document.getElementById('revert-countdown-btn');


    // --- Match Data (will be loaded from JSON) ---
    let matchData = {};

    // --- Countdown Target Date ---
    const targetDate = new Date("July 1, 2025 19:00:00 GMT+0530").getTime();

    // Interval ID for live data fetch
    let liveDataIntervalId;

    // --- Core Display Logic ---
    function updatePageDisplay() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // Check if live match is forced OR if the target date has passed
        if (matchData.isLiveMatchForced || distance < 0) {
            countdownDiv.style.display = 'none'; // Hide countdown
            liveMatchDisplayDiv.style.display = 'block'; // Show live match display
            countdownMessageEl.textContent = "Match is Live!"; // Or "Season has begun!"
            updateLiveScoreDisplay(); // Update scoreboard immediately

            // Start fetching live data if not already running
            if (!liveDataIntervalId) {
                liveDataIntervalId = setInterval(fetchMatchData, 30000); // Fetch every 30 seconds
            }

            // Adjust button visibility only if in admin mode
            if (isAdmin) {
                forceLiveBtn.style.display = 'none';
                revertCountdownBtn.style.display = 'inline-block'; // Show revert button
            }
        } else {
            // Match is in the future and not forced live
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownDaysEl.textContent = String(days).padStart(2, '0');
            countdownHoursEl.textContent = String(hours).padStart(2, '0');
            countdownMinutesEl.textContent = String(minutes).padStart(2, '0');
            countdownSecondsEl.textContent = String(seconds).padStart(2, '0');
            countdownMessageEl.textContent = "Get ready for the NCL Nomads season kickoff!";

            liveMatchDisplayDiv.style.display = 'none'; // Ensure live match display is hidden
            countdownDiv.style.display = 'block'; // Ensure countdown is visible

            // Stop live data fetch interval if running
            if (liveDataIntervalId) {
                clearInterval(liveDataIntervalId);
                liveDataIntervalId = null;
            }

            // Adjust button visibility only if in admin mode
            if (isAdmin) {
                forceLiveBtn.style.display = 'inline-block';
                revertCountdownBtn.style.display = 'none'; // Hide revert button
            }
        }
    }

    // --- Fetch Match Data from score_data.json ---
    async function fetchMatchData() {
        try {
            const response = await fetch('score_data.json?' + new Date().getTime()); // Cache-busting
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const fetchedData = await response.json();
            // Only update matchData if it's actually different to avoid unnecessary UI redraws
            if (JSON.stringify(matchData) !== JSON.stringify(fetchedData)) {
                 matchData = fetchedData;
                 updatePageDisplay(); // Update display based on new data and logic
            }
        } catch (error) {
            console.error("Could not fetch match data:", error);
            // Fallback if data can't be loaded (e.g., first visit before JSON is pushed)
            if (Object.keys(matchData).length === 0) { // Only set fallback if matchData is empty
                matchData = {
                    team1: { name: "NCL Nomads", runs: 0, wickets: 0, overs: "0.0" },
                    team2: { name: "Opponent Team", runs: 0, wickets: 0, overs: "0.0" },
                    status: "Error loading data or match not started.",
                    isLiveMatchForced: false // Default to false
                };
                updatePageDisplay();
            }
        }
    }

    // Function to update the displayed scores (for live match section)
    function updateLiveScoreDisplay() {
        team1NameEl.textContent = matchData.team1.name;
        team1RunsEl.textContent = matchData.team1.runs;
        team1WicketsEl.textContent = matchData.team1.wickets;
        team1OversEl.textContent = matchData.team1.overs;

        team2NameEl.textContent = matchData.team2.name;
        team2RunsEl.textContent = matchData.team2.runs;
        team2WicketsEl.textContent = matchData.team2.wickets;
        team2OversEl.textContent = matchData.team2.overs;

        matchStatusEl.textContent = matchData.status;

        // Update input fields with current values for the selected team, only if in admin mode
        if (isAdmin) {
            const selectedTeam = currentTeamSelect.value;
            if (selectedTeam === 'team1') {
                runsInput.value = matchData.team1.runs;
                wicketsInput.value = matchData.team1.wickets;
                oversInput.value = matchData.team1.overs;
            } else if (selectedTeam === 'team2') {
                runsInput.value = matchData.team2.runs;
                wicketsInput.value = matchData.team2.wickets;
                oversInput.value = matchData.team2.overs;
            }
            matchStatusInput.value = matchData.status; // Always update status input
        }
    }

    // --- Event Listeners for Admin Controls (only if in admin mode) ---
    if (isAdmin) {
        // Update main score
        updateScoreBtn.addEventListener('click', () => {
            const selectedTeam = currentTeamSelect.value;
            const newRuns = parseInt(runsInput.value);
            const newWickets = parseInt(wicketsInput.value);
            let newOvers = oversInput.value;
            const newStatus = matchStatusInput.value;

            // Basic validation (same as before)
            if (isNaN(newRuns) || newRuns < 0) { alert('Please enter valid runs.'); return; }
            if (isNaN(newWickets) || newWickets < 0 || newWickets > 10) { alert('Please enter valid wickets (0-10).'); return; }
            if (newOvers.includes('.') && parseInt(newOvers.split('.')[1]) >= 6) { alert('Invalid overs format. Balls should be between 0 and 5 (e.g., 5.3, not 5.6).'); return; }

            let updatedMatchData = JSON.parse(JSON.stringify(matchData)); // Create a deep copy

            if (selectedTeam === 'team1') {
                updatedMatchData.team1.runs = newRuns;
                updatedMatchData.team1.wickets = newWickets;
                updatedMatchData.team1.overs = newOvers;
            } else if (selectedTeam === 'team2') {
                updatedMatchData.team2.runs = newRuns;
                updatedMatchData.team2.wickets = newWickets;
                updatedMatchData.team2.overs = newOvers;
            }
            updatedMatchData.status = newStatus;

            // Force live if user is updating score and it's not already forced/past target date
            if (!matchData.isLiveMatchForced && (new Date().getTime() < targetDate)) {
                 updatedMatchData.isLiveMatchForced = true;
            }

            // Display the JSON output
            const jsonOutput = JSON.stringify(updatedMatchData, null, 2);
            alert("Copy this JSON and update score_data.json on GitHub/Netlify:\n\n" + jsonOutput);

            // Update display immediately for admin feedback
            matchData = updatedMatchData;
            updatePageDisplay(); // Re-evaluate display mode and update scoreboard
        });

        // Force Live Match button
        forceLiveBtn.addEventListener('click', () => {
            let updatedMatchData = JSON.parse(JSON.stringify(matchData));
            updatedMatchData.isLiveMatchForced = true;

            const jsonOutput = JSON.stringify(updatedMatchData, null, 2);
            alert("Copy this JSON and update score_data.json on GitHub/Netlify:\n\n" + jsonOutput);

            matchData = updatedMatchData;
            updatePageDisplay(); // Force re-evaluation of display
        });

        // Revert to Countdown button
        revertCountdownBtn.addEventListener('click', () => {
            let updatedMatchData = JSON.parse(JSON.stringify(matchData));
            updatedMatchData.isLiveMatchForced = false;

            const jsonOutput = JSON.stringify(updatedMatchData, null, 2);
            alert("Copy this JSON and update score_data.json on GitHub/Netlify:\n\n" + jsonOutput);

            matchData = updatedMatchData;
            updatePageDisplay(); // Force re-evaluation of display
        });

        // Event listener to populate inputs when changing selected team
        currentTeamSelect.addEventListener('change', updateLiveScoreDisplay);
    } // End of isAdmin block

    // Initial load and display
    fetchMatchData(); // Initial fetch to get the `isLiveMatchForced` state
    setInterval(updatePageDisplay, 1000); // Keep updating countdown/checking state every second
});
const scoreControlsDiv = document.querySelector('.score-controls');
const urlParams = new URLSearchParams(window.location.search);
const isAdmin = urlParams.get('admin') === 'true'; // Checks if URL ends with ?admin=true

if (isAdmin) {
    scoreControlsDiv.classList.remove('admin-hidden'); // Remove the hiding class
}
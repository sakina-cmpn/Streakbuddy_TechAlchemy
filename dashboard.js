document.addEventListener('DOMContentLoaded', function() {
    const focusAreasList = document.getElementById('focusAreasList');
    const habitSections = document.getElementById('habitSections');
    const motivationalQuote = document.getElementById('motivationalQuote');
    const messageDiv = document.getElementById('message');

    // Motivational quotes
    const quotes = [
        "Small steps every day lead to big results!",
        "Consistency is the key to success.",
        "You don't have to be great to start, but you have to start to be great.",
        "The secret of getting ahead is getting started.",
        "Every accomplishment starts with the decision to try."
    ];

    // Load focus areas
    const focusAreas = JSON.parse(localStorage.getItem('focusAreas') || '[]');
    focusAreas.forEach(area => {
        const li = document.createElement('li');
        li.textContent = area.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        focusAreasList.appendChild(li);
        
        // Create habit section for each focus area
        const section = document.createElement('div');
        section.className = 'habit-section';
        section.innerHTML = `
            <h3>${area.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h3>
            <div class="habit-form">
                <input type="text" id="habitInput-${area}" placeholder="Add a habit (e.g., Study 1 hour)">
                <button onclick="addHabit('${area}')">Add</button>
            </div>
            <ul id="habitList-${area}" class="habit-list"></ul>
        `;
        habitSections.appendChild(section);
    });

    // Load habits and streaks
    const habits = JSON.parse(localStorage.getItem('habits') || '{}');
    focusAreas.forEach(area => {
        if (!habits[area]) habits[area] = [];
        renderHabits(area, habits[area]);
    });

    // Display random quote
    motivationalQuote.textContent = quotes[Math.floor(Math.random() * quotes.length)];

    // Add habit function
    window.addHabit = function(area) {
        const input = document.getElementById(`habitInput-${area}`);
        const habitText = input.value.trim();
        if (!habitText) {
            messageDiv.textContent = 'Please enter a habit.';
            messageDiv.className = 'message';
            setTimeout(() => { messageDiv.textContent = ''; }, 2000);
            return;
        }
        
        habits[area].push({ text: habitText, streak: 0, completedToday: false, lastCompleted: null });
        localStorage.setItem('habits', JSON.stringify(habits));
        renderHabits(area, habits[area]);
        input.value = '';
        messageDiv.textContent = 'Habit added!';
        messageDiv.className = 'message success';
        setTimeout(() => { messageDiv.textContent = ''; }, 2000);
    };

    // Render habits for a focus area
    function renderHabits(area, habitList) {
        const habitListUl = document.getElementById(`habitList-${area}`);
        habitListUl.innerHTML = '';
        habitList.forEach((habit, index) => {
            const li = document.createElement('li');
            li.className = 'habit-item';
            const today = new Date().toISOString().split('T')[0];
            const isCompleted = habit.completedToday && habit.lastCompleted === today;
            li.innerHTML = `
                <input type="checkbox" ${isCompleted ? 'checked' : ''} onchange="toggleHabit('${area}', ${index})">
                <span>${habit.text}</span>
                <span class="streak">Streak: ${habit.streak}</span>
            `;
            habitListUl.appendChild(li);
        });
    }

    // Toggle habit completion
    window.toggleHabit = function(area, index) {
        const today = new Date().toISOString().split('T')[0];
        const habit = habits[area][index];
        if (!habit.completedToday || habit.lastCompleted !== today) {
            habit.completedToday = true;
            habit.lastCompleted = today;
            const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
            if (habit.lastCompleted === yesterday || habit.streak === 0) {
                habit.streak += 1;
            }
        } else {
            habit.completedToday = false;
            habit.streak = Math.max(0, habit.streak - 1);
        }
        localStorage.setItem('habits', JSON.stringify(habits));
        renderHabits(area, habits[area]);
    };

    // Reset streaks daily
    function resetDaily() {
        const today = new Date().toISOString().split('T')[0];
        focusAreas.forEach(area => {
            habits[area].forEach(habit => {
                if (habit.lastCompleted !== today) {
                    habit.completedToday = false;
                }
            });
        });
        localStorage.setItem('habits', JSON.stringify(habits));
        focusAreas.forEach(area => renderHabits(area, habits[area]));
    }

    // Check daily reset
    const lastReset = localStorage.getItem('lastReset');
    const today = new Date().toISOString().split('T')[0];
    if (lastReset !== today) {
        resetDaily();
        localStorage.setItem('lastReset', today);
    }
});
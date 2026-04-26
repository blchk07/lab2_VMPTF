import React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/api.js';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get('/analytics').then(response => setAnalytics(response.data));
  }, []);

  if (!analytics) return <p>Завантаження...</p>;

  return (
    <section>
      <h1>Аналітика виконання задач</h1>
      <div className="stats">
        <div className="card"><h2>{analytics.total}</h2><p>Усього задач</p></div>
        <div className="card"><h2>{analytics.todo}</h2><p>Заплановано</p></div>
        <div className="card"><h2>{analytics.inProgress}</h2><p>В роботі</p></div>
        <div className="card"><h2>{analytics.done}</h2><p>Виконано</p></div>
        <div className="card"><h2>{analytics.overdue}</h2><p>Прострочено</p></div>
        <div className="card"><h2>{analytics.completionRate}%</h2><p>Відсоток виконання</p></div>
      </div>
    </section>
  );
}

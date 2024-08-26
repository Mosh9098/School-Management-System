import React, { useEffect, useState } from 'react';

const API_URL = 'http://127.0.0.1:5555/courses';

const fetchReports = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }
  return response.json();
};

const createReport = async (report) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(report),
  });
  if (!response.ok) {
    throw new Error('Failed to create report');
  }
  return response.json();
};

const updateReport = async (id, report) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(report),
  });
  if (!response.ok) {
    throw new Error('Failed to update report');
  }
  return response.json();
};

const deleteReport = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete report');
  }
  return response.json();
};

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    id: '',
    title: '',
    description: '',
    date: '',
    author_id: '',
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchReports();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateReport(form.id, form);
        alert('Report updated successfully');
      } else {
        await createReport(form);
        alert('Report created successfully');
      }
      setForm({
        id: '',
        title: '',
        description: '',
        date: '',
        author_id: '',
      });
      setEditing(false);
      const data = await fetchReports();
      setReports(data);
    } catch (error) {
      console.error(editing ? 'Error updating report:' : 'Error creating report:', error);
    }
  };

  const handleEdit = (report) => {
    setForm(report);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteReport(id);
      alert('Report deleted successfully');
      const data = await fetchReports();
      setReports(data);
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  return (
    <div>
      <h1>Manage Reports</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Author ID:</label>
          <input
            type="number"
            name="author_id"
            value={form.author_id}
            onChange={handleChange}
          />
        </div>
        <button type="submit">{editing ? 'Update' : 'Create'} Report</button>
      </form>
      <h2>Report List</h2>
      <ul>
        {reports.map((report) => (
          <li key={report.id}>
            {report.title} - {report.description} - {report.date}
            <button onClick={() => handleEdit(report)}>Edit</button>
            <button onClick={() => handleDelete(report.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reports;

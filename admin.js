document.addEventListener('DOMContentLoaded', function () {
  const statusElement = document.getElementById('admin-status');
  const submissionsList = document.getElementById('submissions-list');

  if (!window.supabaseClient) {
    statusElement.textContent = 'Supabase client unavailable. Verify the CDN and config script order.';
    statusElement.classList.add('error');
    return;
  }

  async function loadSubmissions() {
    statusElement.textContent = 'Loading submissions...';
    statusElement.classList.remove('error');

    const { data, error } = await window.supabaseClient
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      statusElement.textContent = error.message || 'Unable to load submissions.';
      statusElement.classList.add('error');
      return;
    }

    if (!data || data.length === 0) {
      statusElement.textContent = 'No submissions found.';
      return;
    }

    statusElement.textContent = `${data.length} submission${data.length === 1 ? '' : 's'} loaded.`;
    submissionsList.innerHTML = '';

    data.forEach(submission => {
      const card = document.createElement('article');
      card.className = `submission-card ${submission.is_read ? 'read' : 'unread'}`;

      const createdAt = submission.created_at ? new Date(submission.created_at).toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'Unknown date';

      card.innerHTML = `
        <div class="submission-card-header">
          <div>
            <h3>${escapeHtml(submission.full_name || 'Unknown sender')}</h3>
            <p class="submission-card-meta">${escapeHtml(submission.email || 'No email')}</p>
          </div>
          <span class="submission-card-badge">${submission.is_read ? 'Read' : 'Unread'}</span>
        </div>
        <div class="submission-card-meta-row">
          <span><strong>Subject:</strong> ${escapeHtml(submission.subject || 'No subject')}</span>
          <span><strong>Sent:</strong> ${createdAt}</span>
        </div>
        <div class="submission-card-message">${escapeHtml(submission.message || 'No message')}</div>
        <div class="submission-card-footer">
          <button type="button" class="mark-read-button" ${submission.is_read ? 'disabled' : ''}>${submission.is_read ? 'Read' : 'Mark as read'}</button>
        </div>
      `;

      const button = card.querySelector('.mark-read-button');
      if (button && !submission.is_read) {
        button.addEventListener('click', async function () {
          button.disabled = true;
          button.textContent = 'Saving...';

          const { error: updateError } = await window.supabaseClient
            .from('contact_submissions')
            .update({ is_read: true })
            .eq('id', submission.id);

          if (updateError) {
            button.disabled = false;
            button.textContent = 'Mark as read';
            statusElement.textContent = updateError.message || 'Unable to mark as read.';
            statusElement.classList.add('error');
            return;
          }

          card.classList.remove('unread');
          card.classList.add('read');
          card.querySelector('.submission-card-badge').textContent = 'Read';
          button.textContent = 'Read';
        });
      }

      submissionsList.appendChild(card);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  loadSubmissions();
});

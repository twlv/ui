(async function (twlv) {
  let { pid } = twlv.definition;
  render('#elDaemonStatus', pid ? 'running' : 'stopped');
  render('#elDaemonPid', pid ? `PID(${pid})` : '');

  if (pid) {
    let { status } = await twlv.get('/status');
    render('#elSwarmStatus', status ? 'running' : 'stopped');

    let apps = await twlv.get('/apps');
    renderEach('#elSwamApps', apps);

    let channels = await twlv.get('/channels');
    renderEach('#elSwamChannels', channels);

    let discoveries = await twlv.get('/discoveries');
    renderEach('#elSwamDiscoveries', discoveries);
  }
})(window.twlv);

function query (selector) {
  if (typeof selector === 'string') {
    return document.querySelector(selector);
  }
  return selector;
}

function render (selector, value) {
  let el = query(selector);
  if (!el) {
    return;
  }

  if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
    el.value = value;
  } else {
    el.textContent = value;
  }
}

function renderEach (selector, values) {
  let el = query(selector);
  if (!el._template) {
    let template = el.querySelector('template');
    if (template) {
      el._template = document.importNode(template.content, true);
    }
    el.removeChild(template);
  }

  if (!el._template) {
    throw new Error('Fail render each, no template defined');
  }

  el.innerHTML = '';

  values.forEach(value => el.appendChild(renderTemplate(el._template, value)));
}

function renderTemplate (template, value) {
  let fragment = document.importNode(template, true);
  for (let i in value) {
    fragment.querySelectorAll(`[bind-prop="${i}"]`).forEach(el => {
      render(el, value[i]);
    });
  }
  return fragment;
}

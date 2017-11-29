import factory from './httpFactory';

let config = {
  protocol: 'http',
  port: 3030,
  // eslint-disable-next-line no-undef
  hostname: window.location.hostname,
};

export default (cfg) => {
  if (cfg) config = cfg;

  // eslint-disable-next-line no-undef
  return factory(config, fetch);
};

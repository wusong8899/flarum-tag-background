import {extend, override} from 'flarum/extend';
import SettingsPage from './components/SettingsPage';

app.initializers.add('wusong8899-tag-background', () => {
  app.extensionData
    .for('wusong8899-tag-background').registerPage(SettingsPage);
});

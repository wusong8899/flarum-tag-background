import ExtensionPage from 'flarum/components/ExtensionPage';
import Button from 'flarum/components/Button';
import Switch from 'flarum/common/components/Switch';
import LoadingIndicator from "flarum/components/LoadingIndicator";
import sortTags from "flarum/tags/utils/sortTags";
import tagIcon from 'flarum/tags/helpers/tagIcon';

import SetBackgroundModal from './SetBackgroundModal';

let allTags;

export default class SettingsPage extends ExtensionPage {
  oninit(vnode) {
    super.oninit(vnode);
    this.loading = true;

    app.tagList.load(['parent']).then(() => {
      allTags = app.store.all('tags');
      this.loading = false;
      m.redraw();
    });
  }

  content() {
    if (this.loading) {
      return <LoadingIndicator />;
    }

    const tags = sortTags(app.store.all('tags').filter((tag) => !tag.parent()));

    return [
      <div className="tagBackgroundSettingsGroups" style="text-align: left;padding: 20px;">
        {tags.map((tagData) => {
          let wusong8899BackgroundURL = tagData.attribute("wusong8899BackgroundURL");
          let tagBackgroundImageStyle = "background:url("+wusong8899BackgroundURL+");background-size: cover;background-position: center;background-repeat: no-repeat;";
          let tagID = tagData.id();

          return (
            <div className="tagBackgroundContainer">
              <div className="tagBackgroundItemContainer">
                {tagIcon(tagData)}
                <span className="tagBackgroundItemName TagListItem-name">{tagData.name()}</span>

                <div style="padding-top: 10px;display: flex;justify-content: center;align-items: center;">
                  {wusong8899BackgroundURL && (
                    <div style={tagBackgroundImageStyle} className="tagBackgroundImage" onclick={ (e) => app.modal.show(SetBackgroundModal, {tagData}) }></div>
                  )}

                  {!wusong8899BackgroundURL && (
                    <div className="tagBackgroundImage">
                      {Button.component({
                          style:"min-width: 66px;font-size: 12px;font-weight: normal;",
                          className: 'Button',
                          onclick: () => {
                            app.modal.show(SetBackgroundModal, {tagData});
                          }
                        },
                        app.translator.trans('wusong8899-tag-background.admin.set-background')
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>,
    ];
  }



}

import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import sortTags from 'flarum/tags/common/utils/sortTags';
import tagIcon from 'flarum/tags/common/helpers/tagIcon';
import type Tag from 'flarum/tags/common/models/Tag';
import type Mithril from 'mithril';

import SetBackgroundModal from './SetBackgroundModal';

export default class SettingsPage extends ExtensionPage {
  loading = false;

  oninit(vnode: Mithril.Vnode<unknown, this>) {
    super.oninit(vnode);
    this.loading = true;

    // Load tag list with parents
    // @ts-ignore tagList is provided by flarum/tags
    app.tagList.load(['parent']).then(() => {
      this.loading = false;
      m.redraw();
    });
  }

  content(vnode: Mithril.VnodeDOM<unknown, this>): JSX.Element {
    if (this.loading) {
      return <LoadingIndicator />;
    }

    const tags: Tag[] = sortTags(
      // @ts-ignore tags model provided by flarum/tags
      app.store.all('tags').filter((tag: Tag) => !tag.parent())
    );

    return (
      <div className="tagBackgroundSettingsGroups" style="text-align: left;padding: 20px;">
        {tags.map((tagData: Tag) => {
          const wusong8899BackgroundURL = tagData.attribute<string | null>('wusong8899BackgroundURL');
          const tagBackgroundImageStyle = `background:url(${wusong8899BackgroundURL});background-size: cover;background-position: center;background-repeat: no-repeat;`;

          return (
            <div className="tagBackgroundContainer">
              <div className="tagBackgroundItemContainer">
                {tagIcon(tagData)}
                <span className="tagBackgroundItemName TagListItem-name">{tagData.name()}</span>

                <div style="padding-top: 10px;display: flex;justify-content: center;align-items: center;">
                  {wusong8899BackgroundURL && (
                    <div
                      style={tagBackgroundImageStyle as any}
                      className="tagBackgroundImage"
                      onclick={() => app.modal.show(SetBackgroundModal, { tagData })}
                    ></div>
                  )}

                  {!wusong8899BackgroundURL && (
                    <div className="tagBackgroundImage">
                      {Button.component(
                        {
                          style: 'min-width: 66px;font-size: 12px;font-weight: normal;',
                          className: 'Button',
                          onclick: () => {
                            app.modal.show(SetBackgroundModal, { tagData });
                          },
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
      </div>
    );
  }
}


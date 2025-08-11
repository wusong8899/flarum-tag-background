import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import Stream from 'flarum/utils/Stream';

export default class DecorationStorePurchaseModal extends Modal {
  static isDismissibleViaBackdropClick = false;
  static isDismissibleViaCloseButton = true;

  oninit(vnode) {
    super.oninit(vnode);
    this.loading = false;
    this.tagData = this.attrs.tagData;
    this.backgroundUrl = Stream(this.tagData.attribute("wusong8899BackgroundURL"));
  }

  className() {
    return 'Modal--small';
  }

  title() {
    return app.translator.trans('wusong8899-tag-background.admin.set-background');
  }

  content() {

    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group" style="text-align: center;">
              <div className="ModuleItemSettingsLabel">{app.translator.trans('wusong8899-tag-background.admin.item-background-url')}</div>
              <input maxlength="200" className="FormControl" bidi={this.backgroundUrl} />
          </div>

          <div className="Form-group" style="text-align: center;">
            {Button.component(
              {
                style:'min-width:66px;',
                className: 'Button Button--primary',
                disabled: this.loading,
                onclick: () => {
                  this.saveData();
                }
              },
              app.translator.trans('wusong8899-custom-index-page.lib.save')
            )}&nbsp;
            {Button.component(
              {
                style:'min-width:66px;background: rgba(0,0,0,0.1);',
                className: 'Button',
                disabled: this.loading,
                onclick: () => {
                  this.hide();
                }
              },
              app.translator.trans('wusong8899-custom-index-page.lib.cancel')
            )}
          </div>
        </div>
      </div>
    );
  }

  saveData() {
    this.loading = true;

    const backgroundUrl = this.backgroundUrl();
    const tagID = this.tagData.id();

    app.request({
      url: `${app.forum.attribute('apiUrl')}/tagBackgroundSetImage`,
      method: 'POST',
      body: { tagID,backgroundUrl },
    })
    .then((result) => {
        this.hide();
        app.store.pushPayload(result);
        let tagStoreData = app.store.getById("tags",tagID);

        console.log(tagStoreData);
        m.redraw();
      }
    )
    .catch((e) => {
      this.loading = false;
    });
  }

}

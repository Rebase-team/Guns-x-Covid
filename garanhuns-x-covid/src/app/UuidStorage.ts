import { Storage } from '@ionic/storage';


export class UuidSvc {

    static storage: Storage;

    public static getUuid(pvoidCb) {
        this.storage.get('uuid').then((val) => {
            pvoidCb(String((typeof val != "undefined" ? val : '')));
        }).catch((err) => {
            console.log(err);
        })
    }

    public static setUuid(uuid, pvoidOnCompleted) {
        this.storage.set('uuid', uuid).then((val) => {
            pvoidOnCompleted();
        }).catch(err => {
            console.log(err);
        });
    }

}
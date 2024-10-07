if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { HpcTabs, HpcTabsController } from "@normalized:N&&&hpcwebtabs/Index&1.0.0";
class Index extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.HPCController = new HpcTabsController();
        this.urls = [
            'https://m.baidu.com/',
            'https://m.thepaper.cn/',
            'https://www.openharmony.cn/'
        ];
        this.names = [
            ['百度新闻', { "id": 16777237, "type": 20000, params: [], "bundleName": "com.example.mywebui7", "moduleName": "entry" }],
            ['澎湃新闻', { "id": 16777239, "type": 20000, params: [], "bundleName": "com.example.mywebui7", "moduleName": "entry" }],
            ['鸿蒙', { "id": 16777238, "type": 20000, params: [], "bundleName": "com.example.mywebui7", "moduleName": "entry" }]
        ];
        this.finalizeConstruction();
    }
    HPCController;
    @Local
    urls: Array<string>;
    @Local
    names: Array<[
        string,
        Resource
    ]>;
    aboutToAppear(): void {
        console.log("Page first onappear");
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new HpcTabs(this, {
                        WebUrl: this.urls,
                        names: this.names,
                        barMode: "fixed",
                        tabController: this.HPCController,
                        tabStyle: {
                            indicatorWidthWrapTab: true,
                            fontColorSelect: Color.Blue
                        },
                        onWebTabIndicatorBuilder: () => {
                            this.TabIndicator();
                        },
                        onWebTabBarBuilder: (tab, index) => {
                            this.TabItem(tab, index);
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 23, col: 7 });
                    ViewV2.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            WebUrl: this.urls,
                            names: this.names,
                            barMode: "fixed",
                            tabController: this.HPCController,
                            tabStyle: {
                                indicatorWidthWrapTab: true,
                                fontColorSelect: Color.Blue
                            },
                            onWebTabIndicatorBuilder: () => {
                                this.TabIndicator();
                            },
                            onWebTabBarBuilder: (tab, index) => {
                                this.TabItem(tab, index);
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        WebUrl: this.urls,
                        names: this.names,
                        barMode: "fixed",
                        tabController: this.HPCController,
                        tabStyle: {
                            indicatorWidthWrapTab: true,
                            fontColorSelect: Color.Blue
                        }
                    });
                }
            }, { name: "HpcTabs" });
        }
        Column.pop();
    }
    TabIndicator(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
            Stack.backgroundColor(Color.Gray);
            Stack.borderRadius(12);
        }, Stack);
        Stack.pop();
    }
    TabItem(tab: [
        string,
        Resource
    ], index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(tab[1]);
            Image.width(20);
            Image.margin({ bottom: 4 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(tab[0]);
            Context.animation({ duration: 300 });
            Text.fontColor(this.HPCController.selectedTabIndex == index ? Color.Black : Color.Gray);
            Text.fontWeight(this.HPCController.selectedTabIndex == index ? FontWeight.Medium : FontWeight.Normal);
            Text.fontSize(this.HPCController.selectedTabIndex == index ? 18 : 16);
            Context.animation(null);
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.example.mywebui7", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false" });

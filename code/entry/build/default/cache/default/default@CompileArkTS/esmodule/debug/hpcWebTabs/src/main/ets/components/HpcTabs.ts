if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
import { HpcTabsController } from "@normalized:N&&&hpcwebtabs/src/main/ets/components/HpcTabsController&1.0.0";
import { MyDataSource } from "@normalized:N&&&hpcwebtabs/src/main/ets/components/DataSource&1.0.0";
import webview from "@ohos:web.webview";
import { getCommonWeb, createCommonWeb } from "@normalized:N&&&hpcwebtabs/src/main/ets/components/WebRendering&1.0.0";
import type { myNodeController } from "@normalized:N&&&hpcwebtabs/src/main/ets/components/WebRendering&1.0.0";
export type BarMode = "scroll" | "fixed";
export let mydata: MyDataSource = new MyDataSource();
export let uicontext: UIContext;
export let myWebUrl: string[] = [
    'https://m.baidu.com/',
    'https://m.thepaper.cn/',
    'https://www.openharmony.cn/'
];
export class HpcTabs extends ViewV2 {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda, extraInfo) {
        super(parent, elmtId, extraInfo);
        this.initParam("WebUrl", (params && "WebUrl" in params) ? params.WebUrl : undefined);
        this.initParam("names", (params && "names" in params) ? params.names : undefined);
        this.onChange = "onChange" in params ? params.onChange : () => { };
        this.initParam("tabStyle", (params && "tabStyle" in params) ? params.tabStyle : {});
        this.initParam("barMode", (params && "barMode" in params) ? params.barMode : "scroll");
        this.webviewController1 = new webview.WebviewController();
        this.onWebTabBarBuilder = "onWebTabBarBuilder" in params ? params.onWebTabBarBuilder : undefined;
        this.onWebTabIndicatorBuilder = "onWebTabIndicatorBuilder" in params ? params.onWebTabIndicatorBuilder : undefined;
        this.initParam("tabController", (params && "tabController" in params) ? params.tabController : new HpcTabsController());
        this.finalizeConstruction();
    }
    @Param
    readonly WebUrl: string[];
    @Param
    readonly names: Array<[
        string,
        Resource
    ]>;
    @Event
    onChange: (index: number) => void;
    @Param
    readonly tabStyle: MyTabStyle;
    @Param
    readonly barMode: BarMode;
    @Local
    webviewController1: webview.WebviewController;
    onWebTabBarBuilder?: (tab: [
        string,
        Resource
    ], index: number) => void;
    onWebTabIndicatorBuilder?: CustomBuilder;
    @Param
    readonly tabController: HpcTabsController;
    aboutToAppear(): void {
        myWebUrl = this.WebUrl;
        this.tabController.show(this.WebUrl, this.barMode, this.tabStyle);
        this.tabController.animatorDuration = this.tabStyle.animationDuration ?? 300;
        webview.WebviewController.prepareForPageLoad(myWebUrl[0], true, 2);
        uicontext = this.getUIContext();
        createCommonWeb(myWebUrl[0], this.getUIContext(), this.webviewController1);
    }
    @Monitor("WebUrl")
    onTabsChange() {
        this.tabController.show(this.WebUrl, this.barMode, this.tabStyle);
    }
    @Monitor("tabController.selectedTabIndex")
    onTabIndexChange(monitor: IMonitor) {
        const index = monitor.value("tabController.selectedTabIndex")?.now as number;
        this.onChange?.(index);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height(this.tabStyle.barHeight ?? 50);
            Stack.alignContent(Alignment.Start);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            //指示器
            if (this.tabStyle.showIndicator ?? true) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create({ alignContent: this.tabStyle.indicatorAlignment ?? Alignment.Bottom });
                        Stack.padding(this.tabStyle.indicatorPadding ?? 0);
                        Stack.width(this.tabController.indicatorWidth);
                        Stack.height('100%');
                        Stack.position({
                            left: this.tabController.indicatorOffset - this.tabController.indicatorWidth / 2, bottom: 0
                        });
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.onWebTabIndicatorBuilder) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.onWebTabIndicatorBuilder.bind(this)();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.TabIndicatorBuilder.bind(this)();
                            });
                        }
                    }, If);
                    If.pop();
                    Stack.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create(this.tabController.tabScroller);
            Scroll.onAreaChange((_, area) => {
                this.tabController.updateTabContainerArea(area, this.barMode);
            });
            Scroll.scrollable(ScrollDirection.Horizontal);
            Scroll.scrollBar(BarState.Off);
            Scroll.onTouch(event => {
                if (event.type == TouchType.Move) {
                    this.tabController.indicatorAnimator?.cancel();
                }
            });
            Scroll.onDidScroll(() => {
                const offset = this.tabController.tabScroller.currentOffset().xOffset;
                if (!this.tabController.tabIsAnimator) {
                    const tabWidth = this.tabController.tabItemWidth;
                    const locationX = sumOfFirstN(tabWidth, this.tabController.selectedTabIndex) +
                        tabWidth[this.tabController.selectedTabIndex] / 2;
                    this.tabController.indicatorOffset = locationX - offset;
                }
            });
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.onAreaChange((_, area) => {
                this.tabController.updateTabScrollArea(area);
            });
            Row.height('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Stack.create({ alignContent: Alignment.Center });
                    Stack.width(this.tabController.tabItemWidth[index]);
                    Stack.layoutWeight(this.barMode == "fixed" ? 1 : 0);
                    Stack.onClick(() => {
                        this.tabController.selectedTabIndex = index;
                    });
                }, Stack);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.onWebTabBarBuilder) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.onWebTabBarBuilder.bind(this)(item, index);
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.TabItemBuilder.bind(this)(item, index);
                        });
                    }
                }, If);
                If.pop();
                Stack.pop();
            };
            this.forEachUpdateFunction(elmtId, this.names, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        Scroll.pop();
        Stack.pop();
        this.MySwiper.bind(this)(this.tabController);
        Column.pop();
    }
    MySwiper(tabController: HpcTabsController, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Swiper.create(tabController.swiperController);
            Swiper.layoutWeight(1);
            Swiper.onAreaChange((oldValue, newValue) => {
                tabController.swiperOnAreaChange(oldValue, newValue);
            });
            Swiper.onAnimationStart((index, targetIndex, extraInfo) => {
                tabController.swiperOnAnimationStart(index, targetIndex, extraInfo);
            });
            Swiper.onGestureSwipe((index, extraInfo) => {
                tabController.swiperOnGestureSwipe(index, extraInfo);
            });
        }, Swiper);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            NodeContainer.create(getCommonWeb(myWebUrl[0]));
            NodeContainer.height('100%');
            NodeContainer.width('100%');
        }, NodeContainer);
        Stack.pop();
        {
            const __lazyForEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Stack.create();
                    Stack.width('100%');
                    Stack.height('100%');
                }, Stack);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    NodeContainer.create(item);
                    NodeContainer.height('90%');
                    NodeContainer.width('100%');
                }, NodeContainer);
                Stack.pop();
            };
            const __lazyForEachItemIdFunc = (item: string) => item;
            LazyForEach.create("1", this, mydata, __lazyForEachItemGenFunction, __lazyForEachItemIdFunc);
            LazyForEach.pop();
        }
        Swiper.pop();
    }
    TabItemBuilder(tab: [
        string,
        Resource
    ], index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(tab[0]);
            Context.animation({ duration: this.tabStyle.animationDuration ?? 300 });
            Text.fontColor((this.tabController.selectedTabIndex == index ? this.tabStyle.fontColorSelect :
                this.tabStyle.fontColorNormal) ?? this.tabStyle.fontColor);
            Text.fontWeight((this.tabController.selectedTabIndex == index ? this.tabStyle.fontWeightSelect :
                this.tabStyle.fontWeightNormal) ?? this.tabStyle.fontWeight);
            Text.fontSize((this.tabController.selectedTabIndex == index ? this.tabStyle.fontSizeSelect :
                this.tabStyle.fontSizeNormal) ?? this.tabStyle.fontSize);
            Context.animation(null);
        }, Text);
        Text.pop();
    }
    TabIndicatorBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(this.tabStyle.indicatorWidthWrapTab ? '100%' : this.tabStyle.indicatorWidth ?? 25);
            Stack.height(this.tabStyle.indicatorHeight ?? 4);
            Stack.margin(this.tabStyle.indicatorMargin ?? 4);
            Stack.backgroundColor(this.tabStyle.indicatorColor ?? Color.Orange);
            Stack.borderRadius(this.tabStyle.indicatorRadius ?? 2);
        }, Stack);
        Stack.pop();
    }
    public updateStateVars(params) {
        if (params === undefined) {
            return;
        }
        if ("WebUrl" in params) {
            this.updateParam("WebUrl", params.WebUrl);
        }
        if ("names" in params) {
            this.updateParam("names", params.names);
        }
        if ("tabStyle" in params) {
            this.updateParam("tabStyle", params.tabStyle);
        }
        if ("barMode" in params) {
            this.updateParam("barMode", params.barMode);
        }
        if ("tabController" in params) {
            this.updateParam("tabController", params.tabController);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
function sumOfFirstN(numbers: number[], N: number): number {
    // 检查N是否超过数组的长度
    if (N > numbers.length) {
        N = numbers.length;
    }
    // 计算前N个数的和
    let sum = 0;
    for (let i = 0; i < N; i++) {
        sum += numbers[i];
    }
    return sum;
}
export interface MyTabStyle {
    fontSize?: number;
    fontColor?: ResourceColor;
    fontWeight?: FontWeight;
    fontSizeNormal?: number;
    fontSizeSelect?: number;
    fontColorSelect?: ResourceColor;
    fontColorNormal?: ResourceColor;
    fontWeightNormal?: FontWeight;
    fontWeightSelect?: FontWeight;
    //指示器
    showIndicator?: boolean;
    indicatorWidth?: number;
    indicatorHeight?: number;
    indicatorPadding?: number | Padding;
    indicatorMargin?: number | Padding;
    indicatorColor?: ResourceColor;
    indicatorRadius?: number;
    indicatorAlignment?: Alignment;
    //如果为true指示器宽度自适应tab宽度，false则以indicatorWidth为准
    indicatorWidthWrapTab?: boolean;
    //Tabs高度，默认50
    barHeight?: number;
    //Tab Item 左右padding
    tabItemPadding?: number;
    animationDuration?: number;
}

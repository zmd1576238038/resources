/**
 *  @description ElementUI插件
 *  @author liuzhen
 *  @date 2018.05.24
 */
import Vue from 'vue'
import { Tooltip, Popover, Upload, Message, MessageBox, Dialog, Table, TableColumn, Pagination, DatePicker, Row, Col, Tabs, TabPane, Button, Radio, Checkbox, Carousel, CarouselItem, Form, FormItem, Input, InputNumber, Select, Option } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Row)
Vue.use(Col)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Button)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Pagination)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(Upload)
Vue.use(Popover)
Vue.use(Tooltip)

Vue.prototype.$message = Message;

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$alert  = MessageBox.alert;
Vue.prototype.$prompt  = MessageBox.prompt;

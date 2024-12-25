import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined } from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";

import {
  getAllNgDatas,
  addNg,
  setstateNg,
  deleteNgData,
  uploadNgfile,
} from "../redux/reducers/ngSlice";
import {
  Popover,
  Button,
  Input,
  Space,
  Upload,
  Divider,
  Switch,
  Badge,
  Card,
} from "antd";
const SettingNG = () => {
  const dispatch = useDispatch();
  const [ngData, setNgData] = useState({});
  const [wordOption, setWordOption] = useState({});
  const [orwordOption, setOrwordOption] = useState({});
  let { check, ngdatas } = useSelector((state) => state.ng);
  let { userInfo } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.product);
  const [file, setFile] = useState(null);

  const content = (
    <div>
      <Space.Compact style={{ width: "100%" }}>
        <Input
          onChange={(e) => {
            setWordOption((preState) => {
              return { ...preState, value: e.target.value };
            });
          }}
          value={wordOption.value}
        />
        <Button
          className="primary"
          onClick={(e) => {
            use_Ng({
              kind: wordOption.kind,
              value: orwordOption.value,
              editedValue: wordOption.value,
              flag: wordOption.flag,
              userId: userInfo._id,
            });
          }}
          disabled={loading}
          type="default"
        >
          変更
        </Button>
      </Space.Compact>
      <div className=" items-center flex justify-between mx-5 pt-5">
        <Switch
          onClick={(e) => {
            use_Ng({
              kind: wordOption.kind,
              value: wordOption.value,
              flag: e,
              editedValue: wordOption.value,
              userId: userInfo._id,
            });
            setWordOption((preState) => {
              return { ...preState, flag: e };
            });
          }}
          checkedChildren="活性化"
          unCheckedChildren="無効"
          value={wordOption.flag}
        />
        <Button
          size="small"
          type="primary"
          className="primary flex items-center"
          danger
          shape="round"
          disabled={loading}
          onClick={() => {
            dispatch(
              deleteNgData({
                kind: wordOption.kind,
                value: wordOption.value,
                userId: userInfo._id,
              })
            );
          }}
        >
          <DeleteOutlined />
          削除
        </Button>
      </div>
    </div>
  );
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNgData((prevState) => ({
      ...prevState,
      [name]: { value: value, flag: true },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(addNg({ ...ngData, userId: userInfo._id }));
    setNgData({
      ngword: undefined,
      excludeword: undefined,
      ngcategory: undefined,
      ngasin: undefined,
      ngbrand: undefined,
    });
  };
  const use_Ng = (data) => {
    dispatch(setstateNg(data));
  };

  window.onclick = function (event) {
    if (!event.target.matches(".dropbtn")) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains("show")) {
          openDropdown.classList.remove("show");
        }
      }
    }
  };
  const onFileChange = (info) => {
    setFile(info.file);
  };

  const onFileUpload = () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userInfo._id);
    dispatch(uploadNgfile(formData));
  };
  return (
    <section className="absolute h-[92vh] w-full py-3 ">
      <div className="flex gap-3 justify-between h-full px-3 ">
        <div className="card ng-main-content w-full h-full ">
          <div className="">
            <div className="flex w-full gap-3 mb-2">
              <div className=" w-[50%]">
                <Badge.Ribbon text="NGワード" color="DodgerBlue">
                  <Card size="small ng-card">
                    <div className="flex flex-row-reverse mr-20">
                      <Button
                        size="small"
                        onClick={() => {
                          dispatch(
                            deleteNgData({
                              kind: "ngword",
                              value: "all",
                              userId: userInfo._id,
                            })
                          );
                        }}
                      >
                        全削除
                      </Button>
                      {ngdatas.length && (
                        <span>
                          {ngdatas[0].ngword.length}個のNGワード登録済み。
                        </span>
                      )}
                    </div>
                    <Divider className="my-1" />
                    <div className="exhi_words">
                      {ngdatas.length
                        ? ngdatas[0].ngword.map((word, index) => {
                            return (
                              <Popover
                                content={content}
                                onClick={() => {
                                  setOrwordOption({
                                    ...word,
                                    kind: "ngword",
                                  });
                                  setWordOption({ ...word, kind: "ngword" });
                                }}
                                title="設定"
                                trigger="click"
                              >
                                <div key={index} className="exhi_word">
                                  <div className="exhi_word_item">
                                    <label>{word.value}</label>
                                  </div>
                                  <svg
                                    className={
                                      word.flag ? "activate_ng" : "disabled_ng"
                                    }
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      stroke="currentColor"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="1.8"
                                      d="m7 10 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                  </svg>
                                </div>
                              </Popover>
                            );
                          })
                        : "内容なし"}
                    </div>
                  </Card>
                </Badge.Ribbon>
              </div>
              <div className=" w-[50%]">
                <Badge.Ribbon text="除外ワード" color="DodgerBlue">
                  <Card size="small ng-card">
                    <div className="flex flex-row-reverse mr-20">
                      <Button
                        size="small"
                        onClick={() => {
                          dispatch(
                            deleteNgData({
                              kind: "excludeword",
                              value: "all",
                              userId: userInfo._id,
                            })
                          );
                        }}
                      >
                        全削除
                      </Button>
                      {ngdatas.length && (
                        <span>
                          {ngdatas[0].excludeword.length}
                          個の除外ワード登録済み。
                        </span>
                      )}
                    </div>
                    <Divider className="my-1" />

                    <div className="exhi_words">
                      {ngdatas.length
                        ? ngdatas[0].excludeword.map((word, index) => {
                            return (
                              <Popover
                                content={content}
                                onClick={() => {
                                  setOrwordOption({
                                    ...word,
                                    kind: "excludeword",
                                  });
                                  setWordOption({
                                    ...word,
                                    kind: "excludeword",
                                  });
                                }}
                                title="設定"
                                trigger="click"
                              >
                                <div key={index} className="exhi_word">
                                  <div className="exhi_word_item">
                                    <label>{word.value}</label>
                                  </div>
                                  <svg
                                    className={
                                      word.flag ? "activate_ng" : "disabled_ng"
                                    }
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      stroke="currentColor"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="1.8"
                                      d="m7 10 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                  </svg>
                                </div>
                              </Popover>
                            );
                          })
                        : "内容なし"}
                    </div>
                  </Card>
                </Badge.Ribbon>
              </div>
            </div>
            <div className="flex w-full gap-3 mb-2">
              <div className=" w-[50%]">
                <Badge.Ribbon text="NGカテゴリ" color="DodgerBlue">
                  <Card size="small ng-card">
                    <div className="flex flex-row-reverse mr-20">
                      <Button
                        size="small"
                        onClick={() => {
                          dispatch(
                            deleteNgData({
                              kind: "ngcategory",
                              value: "all",
                              userId: userInfo._id,
                            })
                          );
                        }}
                      >
                        全削除
                      </Button>
                      {ngdatas.length && (
                        <span>
                          {ngdatas[0].ngcategory.length}個のNGカテゴリ登録済み。
                        </span>
                      )}
                    </div>
                    <Divider className="my-1" />

                    <div className="exhi_words">
                      {ngdatas.length
                        ? ngdatas[0].ngcategory.map((word, index) => {
                            return (
                              <Popover
                                content={content}
                                onClick={() => {
                                  setOrwordOption({
                                    ...word,
                                    kind: "ngcategory",
                                  });
                                  setWordOption({
                                    ...word,
                                    kind: "ngcategory",
                                  });
                                }}
                                title="設定"
                                trigger="click"
                              >
                                <div key={index} className="exhi_word">
                                  <div className="exhi_word_item">
                                    <label>{word.value}</label>
                                  </div>
                                  <svg
                                    className={
                                      word.flag ? "activate_ng" : "disabled_ng"
                                    }
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      stroke="currentColor"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="1.8"
                                      d="m7 10 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                  </svg>
                                </div>
                              </Popover>
                            );
                          })
                        : "内容なし"}
                    </div>
                  </Card>
                </Badge.Ribbon>
              </div>
              <div className=" w-[50%]">
                <Badge.Ribbon text="NGASIN" color="DodgerBlue">
                  <Card size="small ng-card">
                    <div className="flex flex-row-reverse mr-20">
                      <Button
                        size="small"
                        onClick={() => {
                          dispatch(
                            deleteNgData({
                              kind: "ngasin",
                              value: "all",
                              userId: userInfo._id,
                            })
                          );
                        }}
                      >
                        全削除
                      </Button>
                      {ngdatas.length && (
                        <span>
                          {ngdatas[0].ngasin.length}個のNGASIN登録済み。
                        </span>
                      )}
                    </div>
                    <Divider className="my-1" />

                    <div className="exhi_words">
                      {ngdatas.length
                        ? ngdatas[0].ngasin.map((word, index) => {
                            return (
                              <Popover
                                key={index}
                                content={content}
                                onClick={() => {
                                  setOrwordOption({ ...word, kind: "ngasin" });
                                  setWordOption({ ...word, kind: "ngasin" });
                                }}
                                title="設定"
                                trigger="click"
                              >
                                <div key={index} className="exhi_word">
                                  <div className="exhi_word_item">
                                    <label>{word.value}</label>
                                  </div>
                                  <svg
                                    className={
                                      word.flag ? "activate_ng" : "disabled_ng"
                                    }
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      stroke="currentColor"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="1.8"
                                      d="m7 10 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                  </svg>
                                </div>
                              </Popover>
                            );
                          })
                        : "内容なし"}
                    </div>
                  </Card>
                </Badge.Ribbon>
              </div>
            </div>

            <div className="flex w-full">
              <div className=" w-[50%]">
                <Badge.Ribbon text="NGブランド" color="DodgerBlue">
                  <Card size="small ng-card">
                    <div className="flex flex-row-reverse mr-20">
                      <Button
                        size="small"
                        onClick={() => {
                          dispatch(
                            deleteNgData({
                              kind: "ngbrand",
                              value: "all",
                              userId: userInfo._id,
                            })
                          );
                        }}
                      >
                        全削除
                      </Button>
                      {ngdatas.length && (
                        <span>
                          {ngdatas[0].ngbrand.length}個のNGブランド登録済み。
                        </span>
                      )}
                    </div>
                    <Divider className="my-1" />

                    <div className="exhi_words">
                      {ngdatas.length
                        ? ngdatas[0].ngbrand.map((word, index) => {
                            return (
                              <Popover
                                content={content}
                                onClick={() => {
                                  setOrwordOption({ ...word, kind: "ngbrand" });
                                  setWordOption({ ...word, kind: "ngbrand" });
                                }}
                                title="設定"
                                trigger="click"
                              >
                                <div key={index} className="exhi_word">
                                  <div className="exhi_word_item">
                                    <label>{word.value}</label>
                                  </div>
                                  <svg
                                    className={
                                      word.flag ? "activate_ng" : "disabled_ng"
                                    }
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      stroke="currentColor"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="1.8"
                                      d="m7 10 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                  </svg>
                                </div>
                              </Popover>
                            );
                          })
                        : "内容なし"}
                    </div>
                  </Card>
                </Badge.Ribbon>
              </div>
            </div>
          </div>
        </div>
        <div className="card py-5">
          <form
            className=" min-w-[300px] pt-5 pb-[10px]  h-full flex flex-col justify-between"
            onSubmit={handleSubmit}
          >
            <div>
              <div className="w-full flex gap-5 justify-center items-center">
                <Upload
                  name="file"
                  beforeUpload={(file, FIleList) => false}
                  action=""
                  onChange={onFileChange}
                  multiple={false}
                  className="w-full flex"
                >
                  <Button
                    disabled={loading || check}
                    className=" w-full h-auto"
                    icon={<UploadOutlined />}
                  >
                    ファイル
                    <br />
                    を読み込む
                  </Button>
                </Upload>
                {!file && (
                  <div className="w-full">
                    <span>*.csv/txt</span>
                  </div>
                )}
              </div>
              <Button
                disabled={!file || loading || check}
                className="primary w-full mt-5"
                onClick={onFileUpload}
              >
                送信
              </Button>
            </div>
            <div className="">
              <div className="pb-[20px]">
                <label
                  htmlFor="ngword"
                  className="block text-sm font-medium text-gray-700"
                >
                  NGワード
                </label>
                <div className="mt-1">
                  <Input
                    type="text"
                    id="ngword"
                    name="ngword"
                    onChange={handleInputChange}
                    value={ngData.ngword?.value || ""}
                    className=""
                  />
                </div>
              </div>
              <div className="pb-[20px]">
                <label
                  htmlFor="excludeword"
                  className="block text-sm font-medium text-gray-700"
                >
                  除外ワード
                </label>
                <div className="mt-1">
                  <Input
                    type="text"
                    id="excludeword"
                    name="excludeword"
                    onChange={handleInputChange}
                    value={ngData.excludeword?.value || ""}
                    className=""
                  />
                </div>
              </div>
              <div className="pb-[20px]">
                <label
                  htmlFor="ngcategory"
                  className="block text-sm font-medium text-gray-700"
                >
                  NGカテゴリ
                </label>
                <div className="mt-1">
                  <Input
                    type="text"
                    id="ngcategory"
                    name="ngcategory"
                    onChange={handleInputChange}
                    value={ngData.ngcategory?.value || ""}
                    className=""
                  />
                </div>
              </div>
              <div className="pb-[20px]">
                <label
                  htmlFor="ngasin"
                  className="block text-sm font-medium text-gray-700"
                >
                  NGASIN
                </label>
                <div className="mt-1">
                  <Input
                    type="text"
                    id="ngasin"
                    name="ngasin"
                    onChange={handleInputChange}
                    value={ngData.ngasin?.value || ""}
                    className=""
                  />
                </div>
              </div>
              <div className="pb-[20px]">
                <label
                  htmlFor="ngbrand"
                  className="block text-sm font-medium text-gray-700"
                >
                  NGブランド
                </label>
                <div className="mt-1">
                  <Input
                    type="text"
                    id="ngbrand"
                    name="ngbrand"
                    onChange={handleInputChange}
                    value={ngData.ngbrand?.value || ""}
                    className=""
                  />
                </div>
              </div>
            </div>

            <div>
              <Button
                disabled={loading}
                className="primary h-[40px] w-full mt-8 mb-2"
                htmlType="submit"
              >
                追 加
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SettingNG;

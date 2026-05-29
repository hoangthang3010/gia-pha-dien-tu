const REGEX_REPLACE = {
  notNumber: /[^0-9]/g,
  notCharSpecial: /[^a-zA-Z0-9 ]/g,
  allowedInputCharactersRegex: /[^a-zA-Z0-9 ]/g,
};
const viewAccountJSX = () => null;
const viewContractInfoJSX = () => null;
const moment = () => ({ endOf: () => null, startOf: () => null });
const securityMeasuresList = [];
const attachedFileListNew = [];
const INPUT_FILE_NAME = "";
const MAX_FILE_LENGTH = 1;
const guaranteeTypeListNew = [];
const guaranteeFormList = [];
const guaranteeFormCounterList = [];
const commitList = [];
const releaseMethodList = [];
const languageList = [];
const releaseFormList = [];
const feeGuaranteeList = [];
const feeList = [];
const feeGuaranteeCounterList = [];
const feeCounterList = [];

export const REQ_GUARANTEE = [
    {
        type: "input",
        label: "ECID",
        name: "ecID",
        col: 12,
        reference: {
            egpOnline: [true]
        },
        attributes: {
            required: true,
            disabled: true,
        },
    },
    {
        type: "input",
        label: "Số đề nghị phát hành",
        name: "egpIssueNo",
        col: 12,
        reference: {
            egpOnline: [true]
        },
        attributes: {
            required: true,
            disabled: true,
        }
    },
    {
        type: "input",
        label: "Bên đề nghị PHBL",
        name: "companyName",
        col: 24,
        attributes: {
            required: true,
            maxLength: 250,
        }
    },
    {
        type: "input",
        label: "Số ĐKKD/MST/ QĐ thành lập",
        name: "guaranteeCode",
        col: 12,
        attributes: {
            required: true,
            maxLength: 50
        }
    },
    {
        type: "date",
        label: "Ngày cấp",
        name: "dateRange",
        col: 12,
        attributes: {
            required: true,
            maxLength: 100,
            disabledDate: (current) => current && current > moment().endOf("day")
        },
    },
    {
        type: "input",
        label: "Nơi cấp",
        name: "issuesBy",
        col: 12,
        attributes: {
            required: true,
            maxLength: 150
        }
    },
    {
        type: "input",
        label: "Trụ sở",
        name: "headQuarters",
        col: 12,
        attributes: {
            required: true,
            maxLength: 250
        }
    },
    {
        type: "input",
        label: "Điện thoại",
        name: "repPhone",
        col: 12,
        regex: REGEX_REPLACE.notNumber,
        attributes: {
            maxLength: 20
        }
    },
    {
        type: "input",
        label: "Fax",
        name: "repFax",
        col: 12,
        regex: REGEX_REPLACE.notNumber,
        attributes: {
            maxLength: 20
        }
    },
    {
        type: "input",
        label: "Người đại diện",
        name: "representativeName",
        col: 24,
        attributes: {
            required: true,
            maxLength: 250
        }
    },
    {
        type: "input",
        label: "Chức vụ",
        name: "repTitle",
        col: 12,
        attributes: {
            required: true,
            maxLength: 250
        }
    },
    {
        type: "input",
        label: "CCCD/HC số của người đại diện",
        name: "repId",
        col: 12,
        attributes: {
            maxLength: 50
        }
    },
    {
        type: "input",
        label: "Nơi cấp",
        name: "repIdIssuedBy",
        col: 12,
        attributes: {
            maxLength: 250
        }
    },
    {
        type: "date",
        label: "Ngày cấp",
        name: "repIdIssuedDate",
        col: 12,
        attributes: {
            maxLength: 20
        }
    },
    {
        type: "checkbox",
        label: "Đại diện theo uỷ quyền",
        name: "isAuthorized",
        col: 12,
        renderValue: (value) => value == 1 ? 'Có' : 'Không'
    },
    {
        type: "input",
        label: "Ủy quyền số",
        name: "authority",
        col: 12,
        reference: {
            isAuthorized: [true]
        },
        attributes: {
            maxLength: 50,
            hidden: true,
            required: true,
        }
    },
    {
        type: "date",
        label: "Ngày ủy quyền",
        name: "authorizationDate",
        col: 12,
        reference: {
            isAuthorized: [true]
        },
        attributes: {
            hidden: true,
            required: true,
            disabledDate: (current) => current && current < moment().startOf("day")
        }
    },
    {
        type: "input",
        label: "Người ủy quyền",
        name: "authorizedPerson",
        col: 12,
        reference: {
            isAuthorized: [true]
        },
        attributes: {
            maxLength: 150,
            required: true,
            hidden: true,
        }
    },
    {
        type: "select",
        label: "Tài khoản ký quỹ BL",
        name: "acct1211",
        col: 12,
        reference: {
            isAuthorized: [true]
        },
        attributes: {
            maxLength: 150,
            hidden: true,
            optionLabelCustom: (opt) => viewAccountJSX(opt)
        }
    },
    {
        type: "input",
        label: "Mã tên CN quản lý tài khoản ký quỹ",
        name: "acct1211Brn",
        col: 12,
        reference: {
            isAuthorized: [true]
        },
        attributes: {
            disabled: true,
            required: true,
            maxLength: 100,
            hidden: true,
        }
    },
    {
        type: "select",
        label: "Tài khoản thanh toán",
        name: "depAcct",
        col: 12,
        reference: {
            isAuthorized: [true]
        },
        attributes: {
            description:
                "Phục vụ thu phí theo dõi dòng tiền, trích tiền ký quỹ,...",
            hidden: true,
            maxLength: 150,
            optionLabelCustom: (opt) => viewAccountJSX(opt)
        }
    },
    {
        type: "input",
        label: "Mã tên CN quản lý tài khoản thanh toán",
        name: "depacctBrn",
        col: 12,
        reference: {
            isAuthorized: [true]
        },
        attributes: {
            disabled: true,
            required: true,
            maxLength: 100,
            hidden: true,
        }
    },
]

export const CONTRACT_INFO_PROVIDED_LIMIT = [
    {
        type: "input",
        label: "Số hợp đồng đã ký kết với Ngân hàng",
        name: "contractNo",
        col: 12,
        attributes: {
            required: true,
            maxLength: 200
        }
    },
    {
        type: "date",
        label: "Ngày hợp đồng",
        name: "contractDate",
        col: 12,
        attributes: {
            required: true,
        }
    }
]

export const INFO_GUARANTEE = [
    {
        type: "radio",
        label: "Bên đề nghị bảo lãnh đồng thời là bên được bảo lãnh",
        name: "beneficaryIsApplicant",
        col: 24,
        attributes: {
            required: true,
            options: [
                { label: "Có", value: "1" },
                { label: "Không", value: "0" },
            ],
            defaultValue: '0',
        },
    },
    { type: "textarea", label: "Bên được BL", name: "applicantName", col: 24, attributes: { required: true, maxLength: 2000 } },
    {
        type: "radio",
        label: "Loại hình khách hàng",
        name: "applicantCusType",
        col: 12,
        reference: {
            beneficaryIsApplicant: ["0"]
        },
        attributes: {
            required: true,
            options: [
                { label: "Tổ chức", value: "1" },
                { label: "Cá nhân", value: "2" },
            ],
            defaultValue: '1',
        },
    },
    {
        type: "input",
        label: "Số ĐKKD/MST/QĐ thành lập",
        name: "applicantId",
        col: 12,
        reference: {
            beneficaryIsApplicant: ["0"]
        },
        attributes: {
            required: true,
            maxLength: 50,
        }
    },
    {
        type: "input",
        label: "Nơi cấp",
        name: "applicantIdIssuedBy",
        col: 12,
        reference: {
            beneficaryIsApplicant: ["0"]
        },
        attributes: {
            required: true,
            maxLength: 150
        }
    },
    {
        type: "date",
        label: "Ngày cấp",
        name: "applicantIdIssuedDate",
        col: 12,
        reference: {
            beneficaryIsApplicant: ["0"]
        },
        attributes: {
            required: true
        }
    },
    { type: "textarea", label: "Địa chỉ bên được BL", name: "applicantAddress", col: 24, attributes: { required: true, maxLength: 2000 } },
    {
        type: "input",
        label: "Điện thoại",
        name: "applicantPhone",
        col: 12,
        reference: {
            beneficaryIsApplicant: ["0"]
        },
        regex: REGEX_REPLACE.notNumber,
        attributes: {
            maxLength: 20
        }
    },
    {
        type: "input",
        label: "Fax",
        name: "applicantFax",
        reference: {
            beneficaryIsApplicant: ["0"]
        },
        regex: REGEX_REPLACE.notNumber,
        col: 12,
        attributes: {
            maxLength: 20
        }
    },
    {
        type: "radio",
        label: "Bên được BL là liên danh",
        name: "isJointVenture",
        col: 24,
        attributes: {
            required: true,
            options: [
                { label: "Có", value: "1" },
                { label: "Không", value: "0" },
            ],
            defaultValue: '0',
        },
    },
    {
        type: "select",
        label: "Vai trò đề nghị PHBL",
        name: "applicantRole",
        col: 12,
        attributes: {
            required: true,
            options: [
                {
                    label: "Đại diện liên danh đề nghị phát hành bảo lãnh",
                    value: "0",
                },
                {
                    label: "Thành viên liên danh (có liên đới trách nhiệm)",
                    value: '1'
                }
            ],
            hidden: true,
        },
        reference: {
            isJointVenture: ['1']
        },
    },
    {
        type: "input",
        label: "Cấu trúc",
        name: "jointVentureStructure",
        col: 12,
        reference: {
            applicantRole: ['1']
        },
        attributes: {
            defaultValue: "Phát hành bảo lãnh trực tiếp cho chủ đầu tư",
            required: true,
            hidden: true,
            maxLength: 100,
            disabled: true,
        },
    },
    {
        type: "textarea",
        label: "Tên liên danh",
        name: "jointVentureName",
        col: 24,
        reference: {
            isJointVenture: ['1']
        },
        attributes: {
            required: true,
            hidden: true,
            maxLength: 2000
        }
    }
]

export const SECURITY_MEASURES = [
    {
        type: "select",
        label: "Biện pháp bảo đảm của khoản BL",
        name: "securityMeasures",
        col: 24,
        attributes: {
            required: true,
            options: securityMeasuresList,
            mode: "multiple",
            closeOnSelect: true
        }
    },
    {
        type: "price-input",
        label: "Số tiền ký quỹ",
        name: "measureAmount",
        col: 12,
        reference: {
            securityMeasures: ['1']
        },
        attributes: {
            hidden: true,
            maxLength: 20,
            required: true
        }
    },
    {
        type: "select",
        label: "Số tài khoản",
        name: "accountNumberMeasuare",
        col: 12,
        reference: {
            securityMeasures: ['1']
        },
        attributes: {
            hidden: true,
            optionLabelCustom: (opt) => viewAccountJSX(opt),
            required: true
        }
    },
    {
        type: "price-input",
        label: "Số tiền phong toả",
        name: "blockedAmt",
        col: 12,
        reference: {
            securityMeasures: ['4']
        },
        attributes: {
            hidden: true,
            maxLength: 20,
            required: true
        }
    },
    {
        type: "select",
        label: "Số tài khoản",
        name: "blockedAcct",
        col: 12,
        reference: {
            securityMeasures: ['4']
        },
        attributes: {
            hidden: true,
            optionLabelCustom: (opt) => viewAccountJSX(opt),
            required: true
        }
    },
    {
        type: "textarea",
        label: "Chi tiết biện pháp đảm bảo khác",
        name: "securityMeasuresDiff",
        col: 24,
        reference: {
            securityMeasures: ['3']
        },
        attributes: {
            required: true,
            hidden: true,
            maxLength: 2500
        }
    },
    {
        type: "textarea",
        label: "Chi tiết cầm cố thế chấp TSĐB",
        name: "pledgeDetail",
        col: 24,
        reference: {
            securityMeasures: ['2']
        },
        attributes: {
            required: true,
            hidden: true,
            maxLength: 2500
        }
    },
    { type: "textarea", label: "Nội dung cam kết của khách hàng", name: "commitContent", col: 24, attributes: { maxLength: 3000 } },
    {
        type: "select",
        label: "Hồ sơ đính kèm",
        name: "attachedDocuments",
        col: 24,
        attributes: {
            required: true,
            mode: "multiple",
            closeOnSelect: true,
            options: attachedFileListNew
        },
    },
    ...attachedFileListNew.map(item => {
        return {
            type: "upload-file",
            name: INPUT_FILE_NAME + item.value,
            label: item.label,
            col: 24,
            attributes: {
                required: true,
                mode: "multiple",
                description:
                    `Số lượng file tối đa là ${MAX_FILE_LENGTH} và dung lượng tối đa 50MB/file`,
                hidden: true,
            },
            reference: {
                'attachedDocuments': [item.value]
            }
        }
    }),
    {
        type: "upload-file",
        name: INPUT_FILE_NAME + 'GDN',
        label: 'Đơn đề nghị PHBL',
        col: 24,
        attributes: {
            required: true,
            mode: "multiple",
            hidden: true,
        },
        reference: {
            'waitToSigHasGDN': [true]
        }
    }
]

export const TRANSACTION_NORMAL_FORM = [
    {
        layout: "single",
        title: "Bên đề nghị phát hành bảo lãnh",
        fields: REQ_GUARANTEE
    },
    {
        layout: "single",
        title: "Thông tin hợp đồng cấp BL theo PT hạn mức",
        fields: CONTRACT_INFO_PROVIDED_LIMIT
    },
    {
        layout: "single",
        title: "Thông tin về bên được bảo lãnh",
        fields: INFO_GUARANTEE
    },
    {
        layout: "single",
        title: "Thông tin đề nghị phát hành bảo lãnh",
        fields: [
            {
                type: "select",
                label: "Loại BL",
                name: "documentType",
                col: 24,
                attributes: {
                    required: true,
                    options: guaranteeTypeListNew,
                    maxLength: 100
                }
            },
            {
                type: "input",
                label: "BL khác",
                name: "otherGuarantee",
                col: 12,
                reference: {
                    documentType: ['8']
                },
                regex: REGEX_REPLACE.notCharSpecial,
                attributes: {
                    required: true,
                    maxLength: 100,
                }
            },
            {
                type: "select",
                label: "Chi nhánh PHBL",
                name: "branch",
                col: 24,
                attributes: {
                    required: true,
                    optionLabelCustom: (opt) => viewContractInfoJSX(opt)
                }
            },
            {
                type: "select",
                label: "Mẫu cam kết BL",
                name: "commitType",
                col: 12,
                attributes: {
                    required: true,
                    options: guaranteeFormList
                }
            },
            {
                type: "checkbox",
                label: "Yêu cầu VTB tạo Bản nháp Cam kết bảo lãnh",
                name: "isDraftRq", col: 12,
                renderValue: (value) => value ? 'Có' : 'Không'
            },
            {
                type: "textarea",
                label: "Mục đích BL",
                name: "guaranteePurpose",
                col: 24,
                attributes: {
                    required: true,
                    maxLength: 2500
                }
            },
            {
                type: "price-input",
                label: "Số tiền đề nghị PHBL",
                name: "amount",
                col: 24,
                attributes: {
                    required: true,
                    multiple: true,
                    maxLength: 20
                }
            },
            {
                type: "radio",
                label: "Thời hạn hiệu lực của bảo lãnh",
                name: "effectiveDate",
                col: 24,
                attributes: {
                    required: true,
                    options: [
                        { label: "Chọn ngày", value: "1" },
                        { label: "Nhập tự do", value: "0" },
                    ],
                },
                reference: {
                    bankModificationSuggest: [false],
                },
                renderValue: (val) => val ? 'Có' : 'Không'
            },
            {
                type: "date",
                label: "Từ ngày",
                name: "effectiveStartDate",
                col: 12,
                reference: {
                    effectiveDate: ['1']
                },
                attributes: {
                    required: true,
                    hidden: true,
                }
            },
            {
                type: "date",
                label: "Đến ngày",
                name: "effectiveEndDate",
                col: 12,
                reference: {
                    effectiveDate: ['1']
                },
                attributes: {
                    required: true,
                    hidden: true,
                }
            },
            {
                type: "textarea",
                label: "Thời gian hiệu lực",
                name: "effectiveDateDesc",
                col: 24,
                reference: {
                    effectiveDate: ['0']
                },
                attributes: {
                    required: true,
                    maxLength: 2500
                }
            },
        ]
    },
    {
        layout: "single",
        title: "Thông tin bên nhận bảo lãnh",
        fields: [
            {
                type: "input",
                label: "Bên nhận BL",
                name: "beneficiaryName",
                col: 24,
                attributes: {
                    required: true,
                    maxLength: 1000
                }
            },
            {
                type: "radio",
                label: "Loại hình khách hàng",
                name: "beneficiaryCusType",
                col: 12,
                attributes: {
                    required: true,
                    options: [
                        { label: "Tổ chức", value: "1" },
                        { label: "Cá nhân", value: "2" },
                    ],
                    defaultValue: '1',
                },
            },
            {
                type: "input",
                label: "Số ĐKKD/MST/QĐ thành lập",
                name: "beneficiaryCode",
                col: 12,
                attributes: {
                    maxLength: 15,
                }
            },
            {
                type: "input",
                label: "Nơi cấp",
                name: "receiverIssuedBy",
                col: 12,
                attributes: {
                    required: true,
                    maxLength: 150
                }
            },
            {
                type: "date",
                label: "Ngày cấp",
                name: "receiverDateRange",
                col: 12,
                attributes: {
                    required: true
                }
            },
            { type: "input", label: "Trụ sở giao dịch", name: "beneficiaryAddress", col: 24, attributes: { required: true, maxLength: 250 } },
            {
                type: "input",
                label: "Điện thoại",
                name: "beneficiaryPhone",
                col: 12,
                regex: REGEX_REPLACE.notNumber,
                attributes: {
                    maxLength: 20
                }
            },
            {
                type: "input",
                label: "Fax",
                name: "beneficiaryFax",
                col: 12,
                regex: REGEX_REPLACE.notNumber,
                attributes: {
                    maxLength: 20
                }
            },
        ]
    },
    {
        layout: "single",
        title: "Thông tin phát hành bảo lãnh",
        fields: [
            {
                type: "select",
                label: "Cách thức phát hành",
                name: "messageType",
                col: 24,
                attributes: {
                    required: true,
                    options: releaseMethodList
                }
            },
            {
                type: "radio",
                label: "Nhập",
                name: "creditBankType",
                col: 24,
                componentsType: 'guaranteeOnline',
                reference: {
                    messageType: ['3']
                },
                attributes: {
                    options: [
                        { label: "Bic code", value: 'BIC' },
                        { label: "Tên và địa chỉ", value: 'ADD' }
                    ],
                    hidden: true,
                },
            },
            {
                type: "bic-code-dropdown",
                label: "Bic code",
                name: "bicCode",
                col: 24,
                reference: {
                    messageType: ['3']
                },
                attributes: {
                    hidden: true,
                    disabled: true
                },
            },
            {
                type: "input",
                label: "Tên",
                name: "bicName",
                col: 24,
                reference: {
                    messageType: ['3']
                },
                attributes: {
                    required: true,
                    hidden: true,
                    maxLength: 35
                }
            },
            {
                type: "input",
                label: "Địa chỉ",
                name: "bicAddress",
                col: 24,
                reference: {
                    messageType: ['3']
                },
                attributes: {
                    required: true,
                    hidden: true,
                    maxLength: 35
                }
            },
            {
                type: "select",
                label: "Ngôn ngữ sử dụng",
                name: "language",
                col: 12,
                attributes: {
                    required: true,
                    options: languageList,
                }
            },
            {
                type: "select",
                label: "Hình thức phát hành",
                name: "issueType",
                col: 12,
                attributes: {
                    required: true,
                    options: releaseFormList,
                }
            },
            {
                type: "input",
                label: "Ngôn ngữ khác",
                name: "provideLanguage",
                col: 12,
                reference: {
                    language: ['other']
                },
                attributes: {
                    required: true,
                    hidden: true,
                    maxLength: 50
                }
            },
            {
                type: "input",
                label: "Hình thức khác",
                name: "provideReleaseMethod",
                col: 12,
                reference: {
                    issueType: ['4']
                },
                attributes: {
                    required: true,
                    hidden: true,
                    style: {
                        marginLeft: 'auto'
                    },
                    maxLength: 250
                }
            },
            {
                type: "textarea",
                label: "Điều kiện NHCT thực hiện nghĩa vụ BL",
                name: "conditionPerform",
                col: 24,
                attributes: {
                    required: true,
                    maxLength: 2500,
                    defaultValue: "Theo mẫu thư đính kèm"
                },
            },
            {
                type: "textarea",
                label: "Điều kiện giảm trừ nghĩa vụ bảo lãnh",
                name: "conditionReduction",
                col: 24,
                attributes: {
                    required: true,
                    maxLength: 2500,
                    defaultValue: "Theo mẫu thư đính kèm"
                },
            },
            {
                type: "select",
                label: "Cách thức gửi cam kết BL",
                name: "sendType",
                col: 24,
                reference: {
                    messageType: ['1', '2']
                },
                attributes: {
                    required: true,
                    options: commitList,
                    hidden: true,
                }
            },
            {
                type: "input",
                label: "NHCT giao Cam kết BL gốc cho ông/bà",
                name: "sendTypeCmnd",
                col: 12,
                reference: {
                    messageType: ['1']
                },
                attributes: {
                    hidden: true,
                    required: true,
                    maxLength: 100
                }
            },
            {
                type: "input",
                label: "CCCD Hộ chiếu số",
                name: "sendTypeNo",
                col: 12,
                reference: {
                    messageType: ['1']
                },
                attributes: {
                    required: true,
                    hidden: true,
                    maxLength: 50
                }
            },
            {
                type: "date",
                label: "Ngày cấp",
                name: "sendTypeDate",
                col: 12,
                reference: {
                    messageType: ['1']
                },
                attributes: {
                    required: true,
                    hidden: true,
                    disabledDate: (current) => current && current > moment().endOf("day")
                },
            },
            {
                type: "input",
                label: "Nơi cấp",
                name: "sendTypeBy",
                col: 12,
                reference: {
                    messageType: ['1']
                },
                attributes: {
                    required: true,
                    hidden: true,
                    maxLength: 50
                }
            },
            {
                type: "select",
                label: "Mức phí bảo lãnh",
                name: "feeGuarantee",
                col: 24,
                attributes: {
                    required: true,
                    options: feeGuaranteeList
                }
            },
            {
                type: "textarea",
                label: "Cụ thể",
                name: "feeGuaranteeDesc",
                col: 24,
                reference: {
                    feeGuarantee: ['2']
                },
                attributes: {
                    required: true,
                    hidden: true,
                    maxLength: 2000
                }
            },
            {
                type: "select",
                label: "Thời điểm thu phí",
                name: "feeTime",
                col: 24,
                attributes: {
                    required: true,
                    options: feeList
                }
            },
            {
                type: "textarea",
                label: "Cụ thể",
                name: "feeTimeDesc",
                col: 24,
                reference: {
                    feeTime: ['2']
                },
                attributes: {
                    required: true,
                    hidden: true,
                    maxLength: 2000
                }
            },
            ...SECURITY_MEASURES
        ]
    }
]


export const TRANSACTION_RECIPROCAL_FORM = [
    {
        layout: "single",
        title: "Bên đề nghị phát hành bảo lãnh",
        fields: REQ_GUARANTEE
    },
    {
        layout: "single",
        title: "Thông tin hợp đồng cấp BL theo PT hạn mức",
        fields: CONTRACT_INFO_PROVIDED_LIMIT
    },
    {
        layout: "single",
        title: "Thông tin về bên được bảo lãnh",
        fields: INFO_GUARANTEE
    },
    {
        layout: "two",
        title: "Thông tin đề nghị phát hành bảo lãnh đối ứng",
        fieldsLeft: {
            title: "Thông tin bảo lãnh chính",
            fields: [
                {
                    type: "select",
                    label: "Loại BL",
                    name: "documentType",
                    col: 24,
                    attributes: {
                        required: true,
                        options: guaranteeTypeListNew,
                        maxLength: 20
                    }
                },
                {
                    type: "input",
                    label: "BL khác",
                    name: "counterGuaranteeTypeDesc",
                    col: 24,
                    reference: {
                        counterGuaranteeType: ['8']
                    },
                    attributes: {
                        required: true,
                        maxLength: 100
                    }
                },
                {
                    type: "select",
                    label: "Mẫu cam kết BL",
                    name: "counterCommitType",
                    col: 24,
                    attributes: {
                        required: true,
                        options: guaranteeFormCounterList
                    }
                },
                {
                    type: "price-input",
                    label: "Số tiền",
                    name: "counterAmount",
                    col: 24,
                    attributes: {
                        required: true,
                    }
                },
                {
                    type: "radio",
                    label: "Thời hạn hiệu lực của BL",
                    name: "counterEffectiveDate",
                    col: 24,
                    attributes: {
                        required: true,
                        options: [
                            { label: "Chọn ngày", value: "1" },
                            { label: "Nhập tự do", value: "0" },
                        ],
                    },
                    reference: {
                        bankModificationSuggest: [false],
                    },
                    renderValue: () => 'Có'
                },
                {
                    type: "date",
                    label: "Từ ngày",
                    name: "counterEffectiveStartDate",
                    col: 24,
                    reference: {
                        counterEffectiveDate: ['1']
                    },
                    attributes: {
                        required: true,
                        hidden: true,
                    }
                },
                {
                    type: "date",
                    label: "Đến ngày",
                    name: "counterEffectiveEndDate",
                    col: 24,
                    reference: {
                        counterEffectiveDate: ['1']
                    },
                    attributes: {
                        required: true,
                        hidden: true,
                    }
                },
                {
                    type: "textarea",
                    label: "Thời gian hiệu lực",
                    name: "counterEffectiveDateDesc",
                    col: 24,
                    reference: {
                        counterEffectiveDate: ['0']
                    },
                    attributes: {
                        required: true,
                        maxLength: 2500,
                        style: { height: '116px' },
                        hidden: true,
                    }
                },
                {
                    type: "textarea",
                    label: "Mục đích BL",
                    name: "counterGuaranteePurpose",
                    col: 24,
                    attributes: {
                        required: true,
                        maxLength: 2500
                    }
                },
                {
                    type: "select",
                    label: "Cách thức phát hành",
                    name: "counterMessageType",
                    col: 24,
                    attributes: {
                        required: true,
                        options: releaseMethodList
                    }
                },
                {
                    type: "radio",
                    label: "Ngân hàng thông báo",
                    name: "counterCreditBankType",
                    col: 24,
                    reference: {
                        counterMessageType: ['3']
                    },
                    attributes: {
                        required: true,
                        options: [
                            { label: "Bic code", value: 'BIC' },
                            { label: "Tên và địa chỉ", value: 'ADD' }
                        ],
                        hidden: true,
                    },
                },
                {
                    type: "bic-code-dropdown",
                    label: "Bic code",
                    name: "counterMessageTypeCode",
                    col: 24,
                    reference: {
                        counterMessageType: ['3']
                    },
                    attributes: {
                        hidden: true,
                        disabled: true
                    },
                    refField: {
                        bicCode: 'counterMessageTypeCode',
                        bankName: 'counterMessageTypeName',
                        bankAddr: 'counterMessageTypeAddress',
                        type: 'counterCreditBankType'
                    }
                },
                {
                    type: "input",
                    label: "Tên",
                    name: "counterMessageTypeName",
                    col: 24,
                    reference: {
                        counterMessageType: ['3']
                    },
                    regex: REGEX_REPLACE.allowedInputCharactersRegex,
                    attributes: {
                        required: true,
                        hidden: true,
                        maxLength: 35
                    }
                },
                {
                    type: "input",
                    label: "Địa chỉ",
                    name: "counterMessageTypeAddress",
                    col: 24,
                    reference: {
                        counterMessageType: ['3']
                    },
                    regex: REGEX_REPLACE.allowedInputCharactersRegex,
                    attributes: {
                        required: true,
                        hidden: true,
                        maxLength: 105
                    }
                },
                {
                    type: "select",
                    label: "Ngôn ngữ sử dụng",
                    name: "counterLanguage",
                    col: 24,
                    attributes: {
                        required: true,
                        options: languageList,
                    }
                },
                {
                    type: "input",
                    label: "Ngôn ngữ khác",
                    name: "provideCounterLanguage",
                    col: 24,
                    reference: {
                        counterLanguage: ['other']
                    },
                    attributes: {
                        required: true,
                        hidden: true,
                        maxLength: 100
                    }
                },
                {
                    type: "select",
                    label: "Hình thức phát hành",
                    name: "counterIssueType",
                    col: 24,
                    attributes: {
                        required: true,
                        options: releaseFormList,
                    }
                },
                {
                    type: "input",
                    label: "Hình thức khác",
                    name: "counterIssueTypeDesc",
                    col: 24,
                    reference: {
                        counterIssueType: ['4']
                    },
                    attributes: {
                        required: true,
                        hidden: true,
                        style: {
                            marginLeft: 'auto'
                        },
                        maxLength: 100
                    }
                },
                {
                    type: "radio",
                    label: "Thông tin của bên BL",
                    name: "counterGuaranteeInfo",
                    required: true,
                    col: 24,
                    attributes: {
                        required: true,
                        options: [
                            { label: "Bic code", value: 'BIC' },
                            { label: "Tên và địa chỉ", value: 'ADD' }
                        ],
                        defaultValue: 'BIC'
                    },
                },
                {
                    type: "bic-code-dropdown",
                    label: "Bic code",
                    name: "counterGuarantorCode",
                    col: 24,
                    attributes: {
                        disabled: true
                    },
                    refField: {
                        bicCode: 'counterGuarantorCode',
                        bankName: 'counterGuarantor',
                        bankAddr: 'counterGuarantorAddress',
                        type: 'counterGuaranteeInfo'
                    }
                },
                {
                    type: "input",
                    label: "Bên BL",
                    name: "counterGuarantor",
                    col: 24,
                    attributes: {
                        required: true,
                        maxLength: 500
                    }
                },
                {
                    type: "input",
                    label: "Địa chỉ",
                    name: "counterGuarantorAddress",
                    col: 24,
                    attributes: {
                        required: true,
                        maxLength: 500
                    }
                },
                {
                    type: "input",
                    label: "Bên nhận BL",
                    name: "counterBeneficiaryName",
                    col: 24,
                    attributes: {
                        required: true,
                        maxLength: 500
                    }
                },
                {
                    type: "input",
                    label: "Địa chỉ bên nhận BL",
                    name: "counterBeneficiaryAddress",
                    col: 24,
                    attributes: {
                        required: true,
                        maxLength: 500
                    }
                },
                {
                    type: 'custom',
                    label: '',
                    name: 'blank_executionFlow',
                    col: 24,
                },
                {
                    type: "textarea",
                    label: "Điều kiện bên bảo lãnh thực hiện nghĩa vụ bảo lãnh",
                    name: "counterConditionPerform",
                    col: 24,
                    attributes: {
                        required: true,
                        maxLength: 2500,
                        defaultValue: 'Theo mẫu thư đính kèm'
                    }
                },
                {
                    type: "textarea",
                    label: "Điều kiện giảm trừ nghĩa vụ bảo lãnh",
                    name: "counterConditionReduction",
                    col: 24,
                    attributes: {
                        required: true,
                        maxLength: 2500,
                        defaultValue: 'Theo mẫu thư đính kèm'
                    }
                },
                {
                    type: "select",
                    label: "Cách thức gửi cam kết BL",
                    name: "counterSendType",
                    col: 24,
                    reference: {
                        counterMessageType: ['1', '2']
                    },
                    attributes: {
                        required: true,
                        options: commitList,
                        hidden: true,
                    }
                },
                {
                    type: "textarea",
                    label: "Chỉ dẫn cụ thể",
                    name: "counterDetailInstruction",
                    col: 24,
                    reference: {
                        counterMessageType: ['1', '2']
                    },
                    attributes: {
                        required: true,
                        maxLength: 2500,
                    }
                },
                {
                    type: "input",
                    label: "Mức phí bảo lãnh",
                    name: "counterFeeGuarantee",
                    col: 24,
                    attributes: {
                        maxLength: 500,
                        required: true,
                        defaultValue: 'Theo yêu cầu của bên bảo lãnh'
                    }
                },
                {
                    type: 'custom',
                    label: '',
                    name: 'blank_feeGuaranteeDesc',
                    attributes: {
                        hidden: true,
                    }
                },
                {
                    type: "input",
                    label: "Thời điểm thu phí",
                    name: "counterFeeTime",
                    col: 24,
                    attributes: {
                        maxLength: 500,
                        required: true,
                        defaultValue: 'Theo yêu cầu của bên bảo lãnh'
                    }
                },
                {
                    type: 'custom',
                    label: '',
                    name: 'blank_feeTimeDesc',
                    attributes: {
                        hidden: true,
                    }
                },
            ],
        },
        fieldsRight: {
            title: "Thông tin bảo lãnh đối ứng",
            fields: [
                {
                    type: 'custom',
                    label: '',
                    name: 'blank_counterGuaranteeType',
                    attributes: {
                        hidden: true,
                    },
                    render: () => '', col: 24
                },
                {
                    type: 'custom',
                    label: '',
                    name: 'blank_otherGuarantee',
                    attributes: {
                        hidden: true,
                    },
                    render: () => '', col: 24
                },
                {
                    type: "input",
                    label: "Mẫu cam kết BL",
                    name: "commitType",
                    col: 24,
                    attributes: {
                        required: true,
                        maxLength: 500
                    }
                },
                {
                    type: "price-input",
                    label: "Số tiền",
                    name: "amount",
                    col: 24,
                    attributes: {
                        required: true,
                        maxLength: 20
                    }
                },
                {
                    type: "radio",
                    label: "Thời hạn hiệu lực của BL",
                    name: "effectiveDate",
                    col: 24,
                    attributes: {
                        required: true,
                        options: [
                            { label: "Chọn ngày", value: "1" },
                            { label: "Nhập tự do", value: "0" },
                        ],
                    },
                    reference: {
                        bankModificationSuggest: [false],
                    },
                    renderValue: () => 'Có'
                },
                {
                    type: "date",
                    label: "Từ ngày",
                    name: "effectiveStartDate",
                    col: 24,
                    reference: {
                        effectiveDate: ['1']
                    },
                    attributes: {
                        required: true,
                        hidden: true,
                    }
                },
                {
                    type: "date",
                    label: "Đến ngày",
                    name: "effectiveEndDate",
                    col: 24,
                    reference: {
                        effectiveDate: ['1']
                    },
                    attributes: {
                        required: true,
                        hidden: true,
                    }
                },
                {
                    type: "textarea",
                    label: "Thời gian hiệu lực",
                    name: "effectiveDateDesc",
                    col: 24,
                    reference: {
                        effectiveDate: ['0']
                    },
                    attributes: {
                        required: true,
                        maxLength: 2500,
                        hidden: true,
                        style: { height: '116px' }
                    }
                },
                {
                    type: "textarea",
                    label: "Mục đích BL",
                    name: "guaranteePurpose",
                    col: 24,
                    attributes: {
                        required: true,
                        maxLength: 2500
                    }
                },
                {
                    type: "select",
                    label: "Cách thức phát hành",
                    name: "messageType",
                    col: 24,
                    attributes: {
                        required: true,
                        options: releaseMethodList
                    }
                },
                {
                    type: "custom",
                    label: "Ngân hàng thông báo",
                    name: "creditBankType",
                    col: 24,
                    attributes: {
                        hidden: true,
                        //     options: [
                        //         { label: "Bic code", value: 'BIC' },
                        //         { label: "Tên và địa chỉ", value: 'ADD' }
                        //     ],
                    },
                    // reference: {
                    //     messageType: ['3']
                    // },
                },
                {
                    type: "custom",
                    label: "Bic code",
                    name: "bicCode",
                    col: 24,
                    attributes: {
                        hidden: true,
                        //     disabled: true
                    },
                    // reference: {
                    //     messageType: ['3']
                    // },
                    // refField: {
                    //     bicCode: 'bicCode',
                    //     bankName: 'bicName',
                    //     bankAddr: 'bicAddress',
                    //     type: 'creditBankType'
                    // }
                },
                {
                    type: "custom",
                    label: "Tên",
                    name: "bicName",
                    col: 24,
                    attributes: {
                        hidden: true,
                        //     required: true,
                        //     maxLength: 20
                    }
                    // reference: {
                    //     messageType: ['3']
                    // },
                },
                {
                    type: "custom",
                    label: "Địa chỉ",
                    name: "bicAddress",
                    col: 24,
                    attributes: {
                        hidden: true,
                        //     required: true,
                        //     maxLength: 20
                    }
                    // reference: {
                    //     messageType: ['3']
                    // },
                },
                {
                    type: "select",
                    label: "Ngôn ngữ sử dụng",
                    name: "language",
                    col: 24,
                    attributes: {
                        required: true,
                        options: languageList,
                    }
                },
                {
                    type: "input",
                    label: "Ngôn ngữ khác",
                    name: "provideLanguage",
                    col: 24,
                    reference: {
                        language: ['other']
                    },
                    attributes: {
                        required: true,
                        hidden: true,
                        maxLength: 50
                    }
                },
                {
                    type: "select",
                    label: "Hình thức phát hành",
                    name: "issueType",
                    col: 24,
                    attributes: {
                        required: true,
                        options: releaseFormList,
                    }
                },
                {
                    type: "input",
                    label: "Hình thức khác",
                    name: "provideReleaseMethod",
                    col: 24,
                    reference: {
                        issueType: ['4']
                    },
                    attributes: {
                        required: true,
                        hidden: true,
                        style: {
                            marginLeft: 'auto'
                        },
                        maxLength: 250
                    }
                },
                {
                    type: "custom",
                    label: "Thông tin của bên BL",
                    name: "guaranteeInfo",
                    attributes: {
                        fakeRequired: true,
                    },
                    col: 24,
                },
                {
                    type: "input",
                    label: "Bên BL đối ứng",
                    name: "counterGuarantorReciprocal",
                    col: 24,
                    attributes: {
                        required: true,
                        disabled: true,
                        defaultValue: 'Ngân hàng TMCP Công Thương Việt Nam',
                        maxLength: 250
                    }
                },
                {
                    type: "select",
                    label: "Chi nhánh PHBL đối ứng",
                    name: "branch",
                    col: 24,
                    attributes: {
                        required: true,
                        optionLabelCustom: (opt) => viewContractInfoJSX(opt),
                        maxLength: 100
                    }
                },
                {
                    type: "custom",
                    label: "",
                    name: "branchAddress",
                    col: 24,
                    attributes: {
                        hidden: true,
                    }
                },
                {
                    type: "input",
                    label: "Bên nhận BL đối ứng",
                    name: "beneficiaryName",
                    col: 24,
                    attributes: {
                        required: true,
                        maxLength: 500
                    }
                },
                {
                    type: "input",
                    label: "Địa chỉ",
                    name: "beneficiaryAddress",
                    col: 24,
                    attributes: {
                        required: true,
                        maxLength: 500
                    }
                },
                {
                    type: "input",
                    label: "Luồng thực hiện",
                    name: "executionFlow",
                    col: 24,
                    attributes: {
                        maxLength: 2500,
                        description: 'Vui lòng nhập nội dung trong trường hợp bên nhận bảo lãnh đối ứng không phải là bên bảo lãnh'
                    }
                },
                {
                    type: "textarea",
                    label: "Điều kiện NHCT thực hiện nghĩa vụ BL",
                    name: "conditionPerform",
                    col: 24,
                    attributes: {
                        required: true,
                        maxLength: 2500,
                        defaultValue: 'NHCT (NH phát hành bảo lãnh đối ứng) cam kết thực hiện thanh toán trong vòng 3 ngày làm việc sau khi nhận được yêu cầu thanh toán bằng điện swift có xác thực gửi tới địa chỉ swift icbvvnvxxxx chỉ ra rằng NH phát hành bảo lãnh/Bên bảo lãnh đã nhận được yêu cầu đòi tiền phù hợp theo cam kết bảo lãnh'
                    }
                },
                {
                    type: "textarea",
                    label: "Điều kiện giảm trừ nghĩa vụ BL",
                    name: "conditionReduction",
                    col: 24,
                    attributes: {
                        required: true,
                        maxLength: 2500,
                        defaultValue: 'Số tiền bảo lãnh đối ứng sẽ được giảm trừ tương ứng sau khi NHCT nhận được điện swift có xác thực xác nhận số tiền bảo lãnh đã được giảm trừ'
                    }
                },
                {
                    type: "select",
                    label: "Cách thức gửi cam kết BL",
                    name: "sendType",
                    col: 24,
                    reference: {
                        messageType: ['1', '2']
                    },
                    attributes: {
                        required: true,
                        hidden: true,
                        disabled: true,
                        maxLength: 100,
                        options: commitList,
                        defaultValue: '2'
                    }
                },
                {
                    type: 'custom',
                    label: '',
                    name: 'blank_counterDetailInstruction',
                    attributes: {
                        hidden: true,
                    }
                },
                {
                    type: "select",
                    label: "Mức phí bảo lãnh",
                    name: "feeGuarantee",
                    col: 24,
                    attributes: {
                        required: true,
                        options: feeGuaranteeCounterList
                    }
                },
                {
                    type: "textarea",
                    label: "Cụ thể",
                    name: "feeGuaranteeDesc",
                    col: 24,
                    reference: {
                        feeGuarantee: ['2']
                    },
                    attributes: {
                        required: true,
                        hidden: true,
                        maxLength: 2500
                    }
                },
                {
                    type: "select",
                    label: "Thời điểm thu phí",
                    name: "feeTime",
                    col: 24,
                    attributes: {
                        required: true,
                        options: feeCounterList
                    }
                },
                {
                    type: "textarea",
                    label: "Cụ thể",
                    name: "feeTimeDesc",
                    col: 24,
                    reference: {
                        feeTime: ['2']
                    },
                    attributes: {
                        required: true,
                        hidden: true,
                        maxLength: 2500
                    }
                },
            ],
        },
    },
    {
        layout: "single",
        title: "Cách thức thu phí và xuất hóa đơn",
        fields: [
            {
                type: "select",
                label: "Cách thức thu phí và xuất hóa đơn",
                name: "feeInvoiceMethod",
                col: 24,
                attributes: {
                    required: true,
                    options: feeInvoiceList,
                }
            },
        ]
    },
    {
        layout: "single",
        title: "Biện pháp đảm bảo và hồ sơ đính kèm của bảo lãnh đối ứng",
        fields: SECURITY_MEASURES
    }
]
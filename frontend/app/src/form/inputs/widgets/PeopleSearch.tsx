/* eslint-disable jsx-a11y/img-redundant-alt */
import { EuiCheckboxGroup, EuiPopover, EuiText } from '@elastic/eui';
import { url } from 'inspector';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../../colors';
import { LanguageObject } from '../../../people/utils/language_label_style';
import ImageButton from '../../../sphinxUI/Image_button';

const languages = [
  'Lightning',
  'Javascript',
  'Typescript',
  'Node',
  'Golang',
  'Swift',
  'Kotlin',
  'MySQL',
  'PHP',
  'R',
  'C#',
  'C++',
  'Java',
  'Rust'
];

const GetValue = (arr: any) => {
  return arr.map((val) => {
    return {
      id: val,
      label: val,
      value: val
    };
  });
};

const codingLanguages = GetValue(languages);

const InvitePeopleSearch = (props) => {
  const color = colors['light'];
  const [searchValue, setSearchValue] = useState<string>('');
  const [peopleData, setPeopleData] = useState<any>(props?.peopleList);
  const [inviteNameId, setInviteNameId] = useState<number>(0);
  const [checkboxIdToSelectedMap, setCheckboxIdToSelectedMap] = useState({});
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [labels, setLabels] = useState<any>([]);

  const onButtonClick = () => setIsPopoverOpen((isPopoverOpen) => !isPopoverOpen);
  const closePopover = () => setIsPopoverOpen(false);

  useEffect(() => {
    setLabels(LanguageObject.filter((x) => checkboxIdToSelectedMap[x.label]));
    setPeopleData(
      (Object.keys(checkboxIdToSelectedMap).every((key) => !checkboxIdToSelectedMap[key])
        ? props?.peopleList
        : props?.peopleList?.filter(({ extras }) =>
            extras?.coding_languages?.some(({ value }) => checkboxIdToSelectedMap[value] ?? false)
          )
      )?.filter((x) => x?.owner_alias.toLowerCase()?.includes(searchValue.toLowerCase()))
    );
  }, [checkboxIdToSelectedMap, searchValue]);

  useEffect(() => {
    if (
      searchValue === '' &&
      Object.keys(checkboxIdToSelectedMap).every((key) => !checkboxIdToSelectedMap[key])
    ) {
      setPeopleData(props?.peopleList);
    }
  }, [searchValue, props, checkboxIdToSelectedMap]);

  const handler = useCallback((e, value) => {
    if (value === '') {
      setSearchValue(e.target.value);
    } else {
      setSearchValue(value);
    }
  }, []);

  const onChange = (optionId) => {
    const newCheckboxIdToSelectedMap = {
      ...checkboxIdToSelectedMap,
      ...{
        [optionId]: !checkboxIdToSelectedMap[optionId]
      }
    };

    setCheckboxIdToSelectedMap(newCheckboxIdToSelectedMap);
  };

  return (
    <SearchOuterContainer color={color}>
      <div className="SearchSkillContainer">
        <input
          value={searchValue}
          className="SearchInput"
          onChange={(e) => {
            handler(e, '');
          }}
          placeholder={'Type to search ...'}
          style={{
            background: color.pureWhite,
            color: color.text1,
            fontFamily: 'Barlow'
          }}
        />
        <EuiPopover
          className="EuiPopOver"
          anchorPosition="downRight"
          panelStyle={{
            marginTop: '-8px',
            boxShadow: 'none',
            borderRadius: '6px 0px 6px 6px',
            backgroundImage: "url('/static/panel_bg.svg')",
            backgroundRepeat: 'no-repeat',
            // backgroundSize: 'cover'
            outline: 'none'
          }}
          button={
            <div
              className="SkillSetContainer"
              onClick={onButtonClick}
              style={{
                border: !isPopoverOpen ? '' : `1px solid ${color?.blue1}`,
                borderBottom: !isPopoverOpen ? '' : `1px solid ${color?.grayish.G700}`,
                borderRadius: !isPopoverOpen ? '' : '4px 4px 0px 0px'
              }}>
              <EuiText
                style={{
                  fontSize: '12px',
                  fontFamily: 'Barlow'
                }}>
                Skills
              </EuiText>
            </div>
          }
          isOpen={isPopoverOpen}
          closePopover={closePopover}>
          <EuiPopOverCheckbox className="CheckboxOuter" color={color}>
            <EuiCheckboxGroup
              options={codingLanguages}
              idToSelectedMap={checkboxIdToSelectedMap}
              onChange={(id) => {
                onChange(id);
              }}
            />
          </EuiPopOverCheckbox>
        </EuiPopover>
      </div>
      <LabelsContainer>
        {labels &&
          labels?.map((x, index) => (
            <Label key={x.label} value={x}>
              <EuiText className="labelText">{x.label}</EuiText>
            </Label>
          ))}
      </LabelsContainer>

      <div className="PeopleList">
        {peopleData?.slice(0, 50)?.map((value) => {
          return (
            <div className="People" key={value.id}>
              <div className="PeopleDetailContainer">
                <div className="ImageContainer">
                  <img
                    src={value.img || '/static/person_placeholder.png'}
                    alt={'user-image'}
                    height={'100%'}
                    width={'100%'}
                  />
                </div>
                <EuiText className="PeopleName">{value.owner_alias}</EuiText>
              </div>
              <ImageButton
                buttonText={inviteNameId === value?.id ? ' Invited' : ' Invite'}
                ButtonContainerStyle={{
                  width: '74.58px',
                  height: '32px'
                }}
                buttonAction={(e) => {
                  handler('', value.owner_alias);
                  setInviteNameId(value.id);
                  props?.handleChange({
                    owner_alias: value.owner_alias,
                    owner_pubkey: value.owner_pubkey,
                    img: value.img,
                    value: value.owner_pubkey,
                    label: `${value.owner_alias} (${value.owner_alias
                      .toLowerCase()
                      .replace(' ', '')})`
                  });
                  setSearchValue(value.owner_alias);
                }}
              />
            </div>
          );
        })}
        {peopleData?.length === 0 && (
          <div className="no_result_container">
            <EuiText className="no_result_text">No Result Found</EuiText>
          </div>
        )}
      </div>
    </SearchOuterContainer>
  );
};

export default InvitePeopleSearch;

interface styledProps {
  color?: any;
}

interface labelProps {
  value?: any;
}

const SearchOuterContainer = styled.div<styledProps>`
  min-height: 256x;
  max-height: 256x;
  min-width: 292px;
  max-width: 292px;
  background: ${(p) => p?.color && p?.color?.pureWhite};
  display: flex;
  flex-direction: column;
  align-items: center;

  .SearchSkillContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 8px;
    height: fit-content;
    .SearchInput {
      background: ${(p) => p?.color && p?.color?.pureWhite};
      border: 1px solid ${(p) => p?.color && p?.color?.grayish.G600};
      border-radius: 4px;
      width: 177px;
      height: 40px;
      outline: none;
      overflow: hidden;
      caret-color: ${(p) => p?.color && p?.color?.textBlue1};
      padding: 0px 18px;
      margin-right: 11px;
      font-family: Roboto !important;
      font-weight: 400;
      font-size: 13px;
      line-height: 35px;

      :focus-visible {
        background: ${(p) => p?.color && p?.color?.pureWhite};
        border: 1px solid ${(p) => p?.color && p?.color?.blue2};
        outline: none;
        .SearchText {
          outline: none;
          background: ${(p) => p?.color && p?.color?.pureWhite};
          border: 1px solid ${(p) => p?.color && p?.color?.grayish.G600};
          outline: none;
        }
      }
      ::placeholder {
        color: ${(p) => p?.color && p?.color?.grayish.G300};
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        font-size: 13px;
        line-height: 35px;
        display: flex;
        align-items: center;
      }
    }
    .EuiPopOver {
      margin-top: 0px;
      .SkillSetContainer {
        height: 40px;
        width: 103px;
        border: 1px solid ${(p) => p?.color && p?.color?.grayish.G600};
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        user-select: none;
      }
    }
  }

  .PeopleList {
    background: ${(p) => p?.color && p?.color?.grayish.G950};
    width: 400px;
    padding: 0 49px 16px;
    min-height: 256px;
    max-height: 256px;
    overflow-y: scroll;
    .People {
      height: 32px;
      min-width: 291.5813903808594px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;
      padding: 0px 0px 0px 6px;
      .PeopleDetailContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        .ImageContainer {
          height: 32px;
          width: 32px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          object-fit: cover;
        }
        .PeopleName {
          font-family: Barlow;
          font-style: normal;
          font-weight: 500;
          font-size: 13px;
          line-height: 16px;
          color: ${(p) => p?.color && p?.color?.grayish.G10};
          margin-left: 10px;
        }
      }
    }
    .no_result_container {
      display: flex;
      height: 210px;
      justify-content: center;
      align-items: center;
      .no_result_text {
        font-family: Barlow;
        font-size: 16px;
        font-weight: 600;
        color: ${(p) => p?.color && p?.color?.grayish.G50};
        word-spacing: 0.08em;
      }
    }
  }
`;

const EuiPopOverCheckbox = styled.div<styledProps>`
  width: 292px;
  height: 293px;
  padding: 33px 10px 31px 18px;

  &.CheckboxOuter > div {
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    .euiCheckboxGroup__item {
      .euiCheckbox__square {
        top: 5px;
        border: 1px solid ${(p) => p?.color && p?.color?.grayish.G500};
        border-radius: 2px;
      }
      .euiCheckbox__input + .euiCheckbox__square {
        background: ${(p) => p?.color && p?.color?.pureWhite} no-repeat center;
      }
      .euiCheckbox__input:checked + .euiCheckbox__square {
        border: 1px solid ${(p) => p?.color && p?.color?.blue1};
        background: ${(p) => p?.color && p?.color?.blue1} no-repeat center;
        background-image: url('static/checkboxImage.svg');
      }
      .euiCheckbox__label {
        font-family: 'Barlow';
        font-style: normal;
        font-weight: 500;
        font-size: 13px;
        line-height: 16px;
        color: ${(p) => p?.color && p?.color?.grayish.G50};
      }
      input.euiCheckbox__input:checked ~ label {
        color: ${(p) => p?.color && p?.color?.blue1};
      }
    }
  }
`;

const LabelsContainer = styled.div<labelProps>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  min-height: 80px;
  width: 100%;
`;

const Label = styled.div<labelProps>`
  height: 23px;
  display: flex;
  align-items: center;
  text-align: center;
  border: ${(p) => p?.value && p?.value.border};
  background: ${(p) => p?.value && p?.value.background};
  margin-right: 4px;
  border-radius: 4px;
  padding: 2px 6px;
  .labelText {
    font-family: 'Barlow';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
    color: ${(p) => p?.value && p?.value.color};
  }
`;
